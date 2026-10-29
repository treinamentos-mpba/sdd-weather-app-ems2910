import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  fetchWithTimeout,
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../src/services/weatherService';
import { cityFixture } from '../fixtures/weather';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

function geocodingResponse(results: unknown): Response {
  return jsonResponse({ results });
}

function forecastResponse(): Record<string, unknown> {
  return {
    timezone: 'America/Sao_Paulo',
    current: {
      temperature_2m: 22.5,
      weather_code: 2,
    },
    current_units: {
      temperature_2m: '°C',
      weather_code: 'wmo code',
    },
    daily: {
      time: ['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02'],
      weather_code: [0, 2, 3, 61, 999],
      temperature_2m_min: [17, 18, 19, 16, 15],
      temperature_2m_max: [27, 26, 25, 22, 21],
    },
    daily_units: {
      weather_code: 'wmo code',
      temperature_2m_min: '°C',
      temperature_2m_max: '°C',
    },
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Open-Meteo geocoding', () => {
  it('returns no results for a trimmed empty query without fetching', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   \t ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('trims and encodes the query, mapping optional region and timezone', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      geocodingResponse([
        {
          id: 3448439,
          name: 'São Paulo',
          country: 'Brasil',
          admin1: 'São Paulo',
          latitude: -23.55,
          longitude: -46.63,
          timezone: 'America/Sao_Paulo',
        },
        { id: 2267057, name: 'Lisboa', country: 'Portugal', latitude: 38.72, longitude: -9.14 },
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    const cities = await searchCities('  São Paulo &  ');

    expect(String(fetchMock.mock.calls[0][0])).toContain('name=S%C3%A3o%20Paulo%20%26');
    expect(cities).toEqual([
      {
        id: 3448439,
        name: 'São Paulo',
        region: 'São Paulo',
        country: 'Brasil',
        latitude: -23.55,
        longitude: -46.63,
        timezone: 'America/Sao_Paulo',
      },
      {
        id: 2267057,
        name: 'Lisboa',
        country: 'Portugal',
        latitude: 38.72,
        longitude: -9.14,
      },
    ]);
  });

  it('rejects a response without an explicit results list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({})));

    await expect(searchCities('Nenhum lugar')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('accepts an explicit empty geocoding result list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(geocodingResponse([])));

    await expect(searchCities('Lugar inexistente')).resolves.toEqual([]);
  });

  it('rejects null as a geocoding result list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ results: null })));

    await expect(searchCities('Lugar inexistente')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('rejects malformed city records instead of treating them as no results', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(geocodingResponse([{ name: 'Inválida' }])));

    await expect(searchCities('Inválida')).rejects.toThrow(
      'Resposta inválida do serviço de localidades.',
    );
  });

  it('reports HTTP, network and invalid JSON failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 503)));
    await expect(searchCities('Recife')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: expect.stringContaining('HTTP 503'),
    });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(searchCities('Recife')).rejects.toThrow(
      'Não foi possível conectar ao serviço Open-Meteo.',
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new SyntaxError('invalid JSON')),
      }),
    );
    await expect(searchCities('Recife')).rejects.toThrow(
      'Resposta inválida do serviço meteorológico.',
    );
  });
});

describe('Open-Meteo forecast', () => {
  it('requests the selected coordinates and maps exactly five daily forecasts', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(forecastResponse()));
    vi.stubGlobal('fetch', fetchMock);

    const data = await getWeather(cityFixture);
    const [url] = fetchMock.mock.calls[0] as [string];
    const params = new URL(url).searchParams;

    expect(url).toContain('https://api.open-meteo.com/v1/forecast');
    expect(params.get('latitude')).toBe(String(cityFixture.latitude));
    expect(params.get('longitude')).toBe(String(cityFixture.longitude));
    expect(params.get('temperature_unit')).toBe('celsius');
    expect(params.get('forecast_days')).toBe('5');
    expect(params.get('timezone')).toBe('auto');
    expect(params.get('current')).toBe('temperature_2m,weather_code');
    expect(params.get('daily')).toContain('temperature_2m_min');
    expect(data.city).toBe(cityFixture);
    expect(data.timezone).toBe('America/Sao_Paulo');
    expect(data.current.condition).toEqual({
      label: 'Parcialmente nublado',
      icon: 'partly-cloudy',
    });
    expect(data.forecast).toHaveLength(5);
    expect(data.forecast.map((day) => day.condition.label)).toEqual([
      'Céu limpo',
      'Parcialmente nublado',
      'Nublado',
      'Chuva fraca',
      'Condição desconhecida',
    ]);
  });

  it('rejects incomplete current conditions and missing timezone', async () => {
    const noCurrent = forecastResponse();
    delete noCurrent.current;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(noCurrent)));
    await expect(getWeather(cityFixture)).rejects.toBeInstanceOf(WeatherServiceError);

    const noTimezone = forecastResponse();
    delete noTimezone.timezone;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(noTimezone)));
    await expect(getWeather(cityFixture)).rejects.toThrow('incompletos ou incompatíveis');

    const noDaily = forecastResponse();
    delete noDaily.daily;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(noDaily)));
    await expect(getWeather(cityFixture)).rejects.toThrow('A previsão recebida está incompleta.');
  });

  it('rejects missing, null, and invalid essential forecast values', async () => {
    const invalidPayloads: Array<(payload: Record<string, unknown>) => void> = [
      (payload) => {
        (payload.current as Record<string, unknown>).temperature_2m = null;
      },
      (payload) => {
        (payload.current as Record<string, unknown>).weather_code = null;
      },
      (payload) => {
        (payload.daily as Record<string, unknown>).time = [
          '2026-10-29',
          null,
          '2026-10-31',
          '2026-11-01',
          '2026-11-02',
        ];
      },
      (payload) => {
        (payload.daily as Record<string, unknown>).weather_code = [0, 2, null, 61, 0];
      },
      (payload) => {
        (payload.daily as Record<string, unknown>).temperature_2m_min = [17, 18, 19, 16, null];
      },
      (payload) => {
        delete (payload.daily as Record<string, unknown>).temperature_2m_max;
      },
    ];

    for (const invalidate of invalidPayloads) {
      const payload = structuredClone(forecastResponse());
      invalidate(payload);
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(payload)));

      await expect(getWeather(cityFixture)).rejects.toBeInstanceOf(WeatherServiceError);
    }
  });

  it('reports forecast HTTP, network and JSON errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 502)));
    await expect(getWeather(cityFixture)).rejects.toThrow('HTTP 502');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(getWeather(cityFixture)).rejects.toThrow(
      'Não foi possível conectar ao serviço Open-Meteo.',
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new SyntaxError('invalid JSON')),
      }),
    );
    await expect(getWeather(cityFixture)).rejects.toThrow(
      'Resposta inválida do serviço meteorológico.',
    );
  });

  it('rejects inconsistent, short, non-consecutive and incompatible daily data', async () => {
    const mismatched = forecastResponse();
    (mismatched.daily as Record<string, unknown>).temperature_2m_min = [1, 2, 3, 4];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(mismatched)));
    await expect(getWeather(cityFixture)).rejects.toThrow('previsão diária');

    const short = forecastResponse();
    (short.daily as Record<string, unknown>).time = ['2026-10-29', '2026-10-30'];
    (short.daily as Record<string, unknown>).weather_code = [0, 1];
    (short.daily as Record<string, unknown>).temperature_2m_min = [1, 2];
    (short.daily as Record<string, unknown>).temperature_2m_max = [3, 4];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(short)));
    await expect(getWeather(cityFixture)).rejects.toThrow('previsão diária');

    const skippedDate = forecastResponse();
    (skippedDate.daily as Record<string, unknown>).time = [
      '2026-10-29',
      '2026-10-30',
      '2026-11-01',
      '2026-11-02',
      '2026-11-03',
    ];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(skippedDate)));
    await expect(getWeather(cityFixture)).rejects.toThrow('cinco dias consecutivos');

    const incompatibleUnits = forecastResponse();
    (incompatibleUnits.daily_units as Record<string, unknown>).temperature_2m_min = '°F';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(incompatibleUnits)));
    await expect(getWeather(cityFixture)).rejects.toThrow('incompleta ou incompatível');
  });

  it('converts an abort to the timeout message and clears its timer', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = fetchWithTimeout('https://example.test');
    const assertion = expect(request).rejects.toThrow('tempo limite de 10 segundos');
    await vi.advanceTimersByTimeAsync(10_000);
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the timeout when the request completes before the deadline', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(fetchWithTimeout('https://example.test')).resolves.toMatchObject({ status: 204 });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps the timeout active while reading the response body', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn((_url: string, init?: RequestInit) =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener(
              'abort',
              () => reject(new DOMException('Aborted', 'AbortError')),
              { once: true },
            );
          }),
      } as Response),
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = searchCities('Recife');
    const assertion = expect(request).rejects.toThrow('tempo limite de 10 segundos');
    await vi.advanceTimersByTimeAsync(10_000);
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });
});

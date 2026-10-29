import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';

const city = {
  id: 3448439,
  name: 'São Paulo',
  country: 'Brasil',
  admin1: 'São Paulo',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
};

function geocodingResponse(): Response {
  return new Response(JSON.stringify({ results: [city] }), { status: 200 });
}

function forecastResponse(): Response {
  return new Response(
    JSON.stringify({
      timezone: 'America/Sao_Paulo',
      current: {
        temperature_2m: 24,
        weather_code: 2,
      },
      current_units: {
        temperature_2m: '°C',
        weather_code: 'wmo code',
      },
      daily: {
        time: ['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02'],
        weather_code: [0, 2, 3, 61, 0],
        temperature_2m_min: [18, 19, 17, 16, 18],
        temperature_2m_max: [27, 26, 23, 22, 28],
      },
      daily_units: {
        weather_code: 'wmo code',
        temperature_2m_min: '°C',
        temperature_2m_max: '°C',
      },
    }),
    { status: 200 },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App integration', () => {
  it('searches and presents cities without selecting the first result automatically', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValueOnce(geocodingResponse());
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);

    expect(screen.getByRole('link', { name: 'Pular para o conteúdo principal' })).toHaveAttribute(
      'href',
      '#main-content',
    );
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    expect(screen.queryByRole('heading', { name: 'São Paulo' })).not.toBeInTheDocument();

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    const cityOption = await screen.findByRole('button', {
      name: /São Paulo.*Brasil/,
    });
    expect(await screen.findByRole('status')).toHaveTextContent(
      '1 localidade encontrada. Selecione uma para consultar a previsão.',
    );
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toContain('geocoding-api.open-meteo.com');
    expect(fetchMock.mock.calls[0][0]).toContain('name=S%C3%A3o%20Paulo');
    expect(screen.queryByRole('heading', { name: 'São Paulo' })).not.toBeInTheDocument();

    fetchMock.mockResolvedValueOnce(forecastResponse());
    await user.click(cityOption);

    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toContain('api.open-meteo.com/v1/forecast');
    expect(String(fetchMock.mock.calls[1][0])).toContain('latitude=-23.55');

    const firstForecastCard = screen.getAllByRole('article')[0];
    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));
    expect(within(firstForecastCard).getByText('81°F')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('offers retry for a failed real request and distinguishes empty results', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'Recife');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível conectar ao serviço Open-Meteo.',
    );

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada'),
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

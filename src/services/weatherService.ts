import type {
  City,
  ForecastDay,
  WeatherCondition,
  WeatherData,
  WeatherIconName,
} from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;
const TIMEOUT_MESSAGE =
  'A requisição excedeu o tempo limite de 10 segundos. Verifique sua conexão e tente novamente.';
const NETWORK_MESSAGE =
  'Não foi possível conectar ao serviço Open-Meteo. Verifique sua conexão e tente novamente.';

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
  );
}

async function withRequestTimeout<T>(request: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await request(controller.signal);
  } catch (error: unknown) {
    if (error instanceof WeatherServiceError) throw error;
    if (isAbortError(error)) throw new WeatherServiceError(TIMEOUT_MESSAGE);
    throw new WeatherServiceError(NETWORK_MESSAGE);
  } finally {
    clearTimeout(timeout);
  }
}

export function fetchWithTimeout(input: string, init?: RequestInit): Promise<Response> {
  return withRequestTimeout((signal) => fetch(input, { ...init, signal }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

async function getJson(url: string): Promise<unknown> {
  return withRequestTimeout(async (signal) => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new WeatherServiceError(
        `Falha ao consultar o serviço meteorológico (HTTP ${response.status}).`,
      );
    }

    try {
      return (await response.json()) as unknown;
    } catch (error: unknown) {
      if (isAbortError(error)) throw error;
      throw new WeatherServiceError('Resposta inválida do serviço meteorológico.');
    }
  });
}

function mapCity(value: unknown): City | null {
  if (
    !isRecord(value) ||
    !requiredNumber(value.id) ||
    !Number.isInteger(value.id) ||
    typeof value.name !== 'string' ||
    !value.name.trim() ||
    typeof value.country !== 'string' ||
    !value.country.trim() ||
    !requiredNumber(value.latitude) ||
    value.latitude < -90 ||
    value.latitude > 90 ||
    !requiredNumber(value.longitude) ||
    value.longitude < -180 ||
    value.longitude > 180
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    ...(typeof value.admin1 === 'string' && value.admin1 ? { region: value.admin1 } : {}),
    country: value.country,
    latitude: value.latitude,
    longitude: value.longitude,
    ...(typeof value.timezone === 'string' ? { timezone: value.timezone } : {}),
  };
}

export async function searchCities(name: string): Promise<City[]> {
  const query = name.trim();
  if (!query) return [];

  const response = await getJson(
    `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10&language=pt&format=json`,
  );
  if (!isRecord(response)) {
    throw new WeatherServiceError('Resposta inválida do serviço de localidades.');
  }
  if (!Array.isArray(response.results)) {
    throw new WeatherServiceError('Resposta inválida do serviço de localidades.');
  }

  const cities = response.results.map(mapCity);
  if (cities.some((city) => city === null)) {
    throw new WeatherServiceError('Resposta inválida do serviço de localidades.');
  }
  return cities.filter((city): city is City => city !== null);
}

function mapWeatherCode(value: number): WeatherCondition {
  const conditions: Record<number, { label: string; icon: WeatherIconName }> = {
    0: { label: 'Céu limpo', icon: 'sun' },
    1: { label: 'Predominantemente limpo', icon: 'sun' },
    2: { label: 'Parcialmente nublado', icon: 'partly-cloudy' },
    3: { label: 'Nublado', icon: 'cloud' },
    45: { label: 'Nevoeiro', icon: 'cloud' },
    48: { label: 'Nevoeiro com gelo', icon: 'cloud' },
    51: { label: 'Garoa fraca', icon: 'rain' },
    53: { label: 'Garoa moderada', icon: 'rain' },
    55: { label: 'Garoa intensa', icon: 'rain' },
    56: { label: 'Garoa congelante fraca', icon: 'rain' },
    57: { label: 'Garoa congelante intensa', icon: 'rain' },
    61: { label: 'Chuva fraca', icon: 'rain' },
    63: { label: 'Chuva moderada', icon: 'rain' },
    65: { label: 'Chuva forte', icon: 'rain' },
    66: { label: 'Chuva congelante fraca', icon: 'rain' },
    67: { label: 'Chuva congelante forte', icon: 'rain' },
    71: { label: 'Neve fraca', icon: 'cloud' },
    73: { label: 'Neve moderada', icon: 'cloud' },
    75: { label: 'Neve forte', icon: 'cloud' },
    77: { label: 'Grãos de neve', icon: 'cloud' },
    80: { label: 'Pancadas de chuva fracas', icon: 'rain' },
    81: { label: 'Pancadas de chuva moderadas', icon: 'rain' },
    82: { label: 'Pancadas de chuva fortes', icon: 'rain' },
    85: { label: 'Pancadas de neve fracas', icon: 'cloud' },
    86: { label: 'Pancadas de neve fortes', icon: 'cloud' },
    95: { label: 'Trovoada', icon: 'rain' },
    96: { label: 'Trovoada com granizo fraco', icon: 'rain' },
    99: { label: 'Trovoada com granizo forte', icon: 'rain' },
  };
  const condition = conditions[value];
  return condition ? { ...condition } : { label: 'Condição desconhecida', icon: 'cloud' };
}

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function ensureFiveConsecutiveDates(dates: string[]): void {
  for (let index = 1; index < dates.length; index += 1) {
    const previous = Date.parse(`${dates[index - 1]}T00:00:00Z`);
    const current = Date.parse(`${dates[index]}T00:00:00Z`);
    if (current - previous !== 86_400_000) {
      throw new WeatherServiceError('A previsão recebida não contém cinco dias consecutivos.');
    }
  }
}

function mapForecast(response: unknown, city: City): WeatherData {
  if (!isRecord(response) || !isRecord(response.current) || !isRecord(response.daily)) {
    throw new WeatherServiceError('A previsão recebida está incompleta.');
  }

  const current = response.current;
  const currentUnits = isRecord(response.current_units) ? response.current_units : null;
  const daily = response.daily;
  const dailyUnits = isRecord(response.daily_units) ? response.daily_units : null;
  const temperature = current.temperature_2m;
  const weatherCode = current.weather_code;
  if (
    typeof response.timezone !== 'string' ||
    !response.timezone ||
    !currentUnits ||
    currentUnits.temperature_2m !== '°C' ||
    currentUnits.weather_code !== 'wmo code' ||
    !requiredNumber(temperature) ||
    !requiredNumber(weatherCode) ||
    !Number.isInteger(weatherCode)
  ) {
    throw new WeatherServiceError('Os dados atuais recebidos estão incompletos ou incompatíveis.');
  }

  const dates = daily.time;
  const codes = daily.weather_code;
  const minima = daily.temperature_2m_min;
  const maxima = daily.temperature_2m_max;
  if (
    dailyUnits?.weather_code !== 'wmo code' ||
    dailyUnits.temperature_2m_min !== '°C' ||
    dailyUnits.temperature_2m_max !== '°C' ||
    !Array.isArray(dates) ||
    !Array.isArray(codes) ||
    !Array.isArray(minima) ||
    !Array.isArray(maxima) ||
    dates.length < 5 ||
    codes.length !== dates.length ||
    minima.length !== dates.length ||
    maxima.length !== dates.length ||
    !dates.slice(0, 5).every(validDate) ||
    !codes.slice(0, 5).every(requiredNumber) ||
    !codes.slice(0, 5).every(Number.isInteger) ||
    !minima.slice(0, 5).every(requiredNumber) ||
    !maxima.slice(0, 5).every(requiredNumber)
  ) {
    throw new WeatherServiceError('A previsão diária recebida está incompleta ou incompatível.');
  }
  const forecastDates = dates.slice(0, 5) as string[];
  ensureFiveConsecutiveDates(forecastDates);

  const forecast: ForecastDay[] = forecastDates.map((date, index) => ({
    date,
    condition: mapWeatherCode(codes[index] as number),
    minimumCelsius: minima[index] as number,
    maximumCelsius: maxima[index] as number,
  }));
  if (forecast.some((day) => day.minimumCelsius > day.maximumCelsius)) {
    throw new WeatherServiceError('A previsão diária recebida está incompleta ou incompatível.');
  }

  return {
    city,
    timezone: response.timezone,
    current: {
      temperatureCelsius: temperature,
      condition: mapWeatherCode(weatherCode),
    },
    forecast,
  };
}

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    temperature_unit: 'celsius',
    forecast_days: '5',
    timezone: 'auto',
  });
  const response = await getJson(`${FORECAST_URL}?${params.toString()}`);
  return mapForecast(response, city);
}

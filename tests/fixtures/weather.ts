import type { City, WeatherData } from '../../src/types/weather';

export const cityFixture: City = {
  id: 5391959,
  name: 'São Paulo',
  region: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
};

export const weatherFixture: WeatherData = {
  city: cityFixture,
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureCelsius: 24,
    condition: { label: 'Parcialmente nublado', icon: 'partly-cloudy' },
    humidityPercent: 68,
    windKmh: 12,
    precipitationMm: 0.4,
    pressureHpa: 1014,
  },
  forecast: [
    {
      date: '2026-10-29',
      condition: { label: 'Céu limpo', icon: 'sun' },
      minimumCelsius: 18,
      maximumCelsius: 27,
    },
    {
      date: '2026-10-30',
      condition: { label: 'Parcialmente nublado', icon: 'partly-cloudy' },
      minimumCelsius: 19,
      maximumCelsius: 26,
    },
    {
      date: '2026-10-31',
      condition: { label: 'Nublado', icon: 'cloud' },
      minimumCelsius: 17,
      maximumCelsius: 23,
    },
    {
      date: '2026-11-01',
      condition: { label: 'Chuva fraca', icon: 'rain' },
      minimumCelsius: 16,
      maximumCelsius: 22,
    },
    {
      date: '2026-11-02',
      condition: { label: 'Céu limpo', icon: 'sun' },
      minimumCelsius: 18,
      maximumCelsius: 28,
    },
  ],
};

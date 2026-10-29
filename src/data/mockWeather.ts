import type { WeatherReport } from '../types/weather';

/**
 * Entirely fictional sample weather for the visual demo. It is not live
 * weather and is intentionally kept separate from UI components.
 */
const mockWeather: WeatherReport = {
  city: {
    name: 'São Paulo',
    region: 'São Paulo',
    country: 'Brasil',
  },
  current: {
    temperatureCelsius: 24,
    condition: {
      label: 'Parcialmente nublado',
      icon: 'partly-cloudy',
    },
    humidityPercent: 68,
    windKmh: 12,
    precipitationMm: 0.4,
    pressureHpa: 1014,
  },
  forecast: [
    {
      date: '2026-10-29',
      condition: { label: 'Ensolarado', icon: 'sun' },
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
      condition: { label: 'Chuva leve', icon: 'rain' },
      minimumCelsius: 16,
      maximumCelsius: 22,
    },
    {
      date: '2026-11-02',
      condition: { label: 'Ensolarado', icon: 'sun' },
      minimumCelsius: 18,
      maximumCelsius: 28,
    },
  ],
};

export default mockWeather;

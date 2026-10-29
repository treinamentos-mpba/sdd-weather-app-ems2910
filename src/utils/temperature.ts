import type { TemperatureUnit } from '../types/weather';

export function convertTemperature(temperatureCelsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return (temperatureCelsius * 9) / 5 + 32;
  }

  return temperatureCelsius;
}

export function formatTemperature(temperatureCelsius: number, unit: TemperatureUnit): string {
  const temperature = Math.round(convertTemperature(temperatureCelsius, unit));
  const symbol = unit === 'celsius' ? '°C' : '°F';

  return `${temperature}${symbol}`;
}

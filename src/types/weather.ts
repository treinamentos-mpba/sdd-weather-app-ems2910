export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type WeatherIconName = 'sun' | 'partly-cloudy' | 'cloud' | 'rain';

export interface WeatherCondition {
  label: string;
  icon: WeatherIconName;
}

export interface WeatherMetrics {
  temperatureCelsius: number;
  condition: WeatherCondition;
  humidityPercent: number;
  windKmh: number;
  precipitationMm: number;
  pressureHpa: number;
}

export interface ForecastDay {
  date: string;
  condition: WeatherCondition;
  minimumCelsius: number;
  maximumCelsius: number;
}

export interface City {
  id: number;
  name: string;
  region?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface WeatherData {
  city: City;
  timezone: string;
  current: WeatherMetrics;
  forecast: ForecastDay[];
}

export type WeatherReport = WeatherData;

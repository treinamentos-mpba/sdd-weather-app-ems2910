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

export interface WeatherReport {
  city: {
    name: string;
    region: string;
    country: string;
  };
  current: WeatherMetrics;
  forecast: ForecastDay[];
}

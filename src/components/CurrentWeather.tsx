import type { TemperatureUnit, WeatherMetrics } from '../types/weather';
import { formatTemperature } from '../utils/temperature';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  city: {
    name: string;
    region?: string;
    country: string;
  };
  current: WeatherMetrics;
  unit: TemperatureUnit;
}

function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const metrics = [
    {
      label: 'Umidade',
      value: `${current.humidityPercent}%`,
      icon: '💧',
    },
    {
      label: 'Vento',
      value: `${current.windKmh} km/h`,
      icon: '↗',
    },
    {
      label: 'Precipitação',
      value: `${current.precipitationMm} mm`,
      icon: '☂',
    },
    {
      label: 'Pressão',
      value: `${current.pressureHpa} hPa`,
      icon: '◉',
    },
  ];
  const location = [city.region, city.country].filter(Boolean).join(', ');

  return (
    <section aria-labelledby="current-weather-title" className="current-card">
      <div className="current-layout">
        <div>
          <p className="weather-kicker">
            <span aria-hidden="true">☀</span> Clima agora
          </p>
          <h2 className="city-title" id="current-weather-title">
            {city.name}
          </h2>
          <p className="city-location">{location}</p>

          <div className="temperature-row">
            <span className="temperature-value">
              {formatTemperature(current.temperatureCelsius, unit)}
            </span>
            <div className="condition-row">
              <WeatherIcon
                className="h-14 w-14 text-geo-magenta sm:h-16 sm:w-16"
                name={current.condition.icon}
              />
              <p className="condition-label">{current.condition.label}</p>
            </div>
          </div>
        </div>

        <dl className="metrics-grid">
          {metrics.map((metric) => (
            <div className="metric-cell" key={metric.label}>
              <dt className="metric-label">
                <span aria-hidden="true" className="metric-icon">
                  {metric.icon}
                </span>
                {metric.label}
              </dt>
              <dd className="metric-value">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default CurrentWeather;

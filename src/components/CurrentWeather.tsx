import type { CurrentConditions, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/temperature';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  city: {
    name: string;
    region?: string;
    country: string;
  };
  current: CurrentConditions;
  unit: TemperatureUnit;
}

function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const location = [city.region, city.country].filter(Boolean).join(', ');

  return (
    <section aria-labelledby="current-weather-title" className="current-card">
      <div>
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
      </div>
    </section>
  );
}

export default CurrentWeather;

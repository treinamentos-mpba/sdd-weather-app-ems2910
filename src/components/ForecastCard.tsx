import type { ForecastDay, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/temperature';
import WeatherIcon from './WeatherIcon';

interface ForecastCardProps {
  day: ForecastDay;
  unit: TemperatureUnit;
}

function ForecastCard({ day, unit }: ForecastCardProps) {
  const date = new Date(`${day.date}T12:00:00Z`);
  const shortDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  const accessibleDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date);

  return (
    <article
      aria-label={`${accessibleDate}: ${day.condition.label}, mínima ${formatTemperature(day.minimumCelsius, unit)}, máxima ${formatTemperature(day.maximumCelsius, unit)}`}
      className="forecast-card"
    >
      <time className="forecast-date" dateTime={day.date}>
        {shortDate.replace('.', '')}
      </time>
      <WeatherIcon
        className={`my-4 h-12 w-12 ${day.condition.icon === 'sun' ? 'text-geo-magenta' : 'text-geo-purple'}`}
        name={day.condition.icon}
      />
      <p className="forecast-condition">{day.condition.label}</p>
      <div className="forecast-temperatures">
        <span className="forecast-max">{formatTemperature(day.maximumCelsius, unit)}</span>
        <span className="forecast-min">{formatTemperature(day.minimumCelsius, unit)}</span>
      </div>
    </article>
  );
}

export default ForecastCard;

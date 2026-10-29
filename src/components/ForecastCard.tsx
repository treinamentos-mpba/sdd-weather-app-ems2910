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
      className="flex min-h-52 min-w-0 flex-col items-center rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-center transition hover:-translate-y-1 hover:border-accent-400/40 hover:bg-white/[0.075] motion-reduce:transform-none motion-reduce:transition-none sm:p-5"
    >
      <time className="text-sm font-medium capitalize text-slate-300" dateTime={day.date}>
        {shortDate.replace('.', '')}
      </time>
      <WeatherIcon
        className={`my-4 h-12 w-12 ${day.condition.icon === 'sun' ? 'text-sun' : 'text-accent-400'}`}
        name={day.condition.icon}
      />
      <p className="min-h-10 text-sm text-slate-400">{day.condition.label}</p>
      <div className="mt-auto flex w-full items-center justify-center gap-3 pt-3 text-sm font-semibold">
        <span className="text-white">{formatTemperature(day.maximumCelsius, unit)}</span>
        <span className="text-slate-400">{formatTemperature(day.minimumCelsius, unit)}</span>
      </div>
    </article>
  );
}

export default ForecastCard;

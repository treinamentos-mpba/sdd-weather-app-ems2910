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
    <section
      aria-labelledby="current-weather-title"
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-glass backdrop-blur-md sm:p-8 lg:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent-400">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" />
            Clima agora
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            id="current-weather-title"
          >
            {city.name}
          </h2>
          <p className="mt-1 text-slate-400">{location}</p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-6xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">
              {formatTemperature(current.temperatureCelsius, unit)}
            </span>
            <div className="flex items-center gap-3">
              <WeatherIcon
                className="h-14 w-14 text-sun sm:h-16 sm:w-16"
                name={current.condition.icon}
              />
              <p className="max-w-36 text-lg font-medium text-slate-200">
                {current.condition.label}
              </p>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:gap-4">
          {metrics.map((metric) => (
            <div
              className="rounded-2xl border border-white/[0.07] bg-night-900/35 p-4 sm:p-5"
              key={metric.label}
            >
              <dt className="flex items-center gap-2 text-sm text-slate-400">
                <span aria-hidden="true" className="text-lg text-accent-400">
                  {metric.icon}
                </span>
                {metric.label}
              </dt>
              <dd className="mt-3 text-xl font-semibold text-white sm:text-2xl">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default CurrentWeather;

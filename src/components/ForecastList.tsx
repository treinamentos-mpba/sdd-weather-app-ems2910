import type { ForecastDay, TemperatureUnit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: ForecastDay[];
  unit: TemperatureUnit;
}

function ForecastList({ days, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-title" className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent-400">Planeje seus próximos dias</p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl" id="forecast-title">
            Previsão para 5 dias
          </h2>
        </div>
        <span className="hidden text-sm text-slate-400 sm:inline">Máxima / mínima</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {days.map((day) => (
          <ForecastCard day={day} key={day.date} unit={unit} />
        ))}
      </div>
    </section>
  );
}

export default ForecastList;

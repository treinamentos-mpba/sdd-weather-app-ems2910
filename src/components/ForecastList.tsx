import type { ForecastDay, TemperatureUnit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: ForecastDay[];
  unit: TemperatureUnit;
}

function ForecastList({ days, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-title" className="forecast-section">
      <div className="forecast-heading-row">
        <div>
          <p className="eyebrow">★ Planeje seus próximos dias ★</p>
          <h2 className="retro-heading" id="forecast-title">
            Previsão para 5 dias
          </h2>
        </div>
        <span className="sparkle-badge">Máxima / mínima</span>
      </div>
      <div className="forecast-grid">
        {days.map((day) => (
          <ForecastCard day={day} key={day.date} unit={unit} />
        ))}
      </div>
    </section>
  );
}

export default ForecastList;

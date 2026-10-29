import type { TemperatureUnit } from '../types/weather';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const options: { label: string; accessibleLabel: string; value: TemperatureUnit }[] = [
    { label: '°C', accessibleLabel: 'Celsius', value: 'celsius' },
    { label: '°F', accessibleLabel: 'Fahrenheit', value: 'fahrenheit' },
  ];

  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex shrink-0 rounded-xl border border-white/10 bg-white/[0.06] p-1"
      role="group"
    >
      {options.map((option) => (
        <button
          aria-label={option.accessibleLabel}
          aria-pressed={unit === option.value}
          className={`min-w-11 rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 ${
            unit === option.value
              ? 'bg-accent-500 text-white shadow-lg shadow-accent-600/20'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default UnitToggle;

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
    <div aria-label="Unidade de temperatura" className="unit-toggle" role="group">
      {options.map((option) => (
        <button
          aria-label={option.accessibleLabel}
          aria-pressed={unit === option.value}
          className="unit-button"
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

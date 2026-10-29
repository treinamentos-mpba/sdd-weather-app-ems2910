import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import mockWeather from '../../src/data/mockWeather';

describe('CurrentWeather', () => {
  it('shows location, current conditions, and all weather metrics', () => {
    render(<CurrentWeather city={mockWeather.city} current={mockWeather.current} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('São Paulo, Brasil')).toBeInTheDocument();
    expect(screen.getByText('24°C')).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
    expect(screen.getByText('12 km/h')).toBeInTheDocument();
    expect(screen.getByText('0.4 mm')).toBeInTheDocument();
    expect(screen.getByText('1014 hPa')).toBeInTheDocument();
  });

  it('converts the current temperature to Fahrenheit', () => {
    render(
      <CurrentWeather city={mockWeather.city} current={mockWeather.current} unit="fahrenheit" />,
    );

    expect(screen.getByText('75°F')).toBeInTheDocument();
  });
});

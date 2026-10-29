import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import { weatherFixture } from '../fixtures/weather';

describe('CurrentWeather', () => {
  it('shows the location, current temperature, and condition', () => {
    render(
      <CurrentWeather city={weatherFixture.city} current={weatherFixture.current} unit="celsius" />,
    );

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('São Paulo, Brasil')).toBeInTheDocument();
    expect(screen.getByText('24°C')).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(screen.queryByText('Umidade')).not.toBeInTheDocument();
    expect(screen.queryByText('Vento')).not.toBeInTheDocument();
  });

  it('converts the current temperature to Fahrenheit', () => {
    render(
      <CurrentWeather
        city={weatherFixture.city}
        current={weatherFixture.current}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('75°F')).toBeInTheDocument();
  });
});

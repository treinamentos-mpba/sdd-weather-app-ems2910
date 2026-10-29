import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import mockWeather from '../../src/data/mockWeather';

describe('ForecastList', () => {
  it('renders exactly five consecutive daily forecasts with temperature units', () => {
    render(<ForecastList days={mockWeather.forecast} unit="celsius" />);

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(5);
    expect(cards[0]).toHaveAccessibleName(
      'quinta-feira, 29 de outubro: Ensolarado, mínima 18°C, máxima 27°C',
    );
    expect(cards[4]).toHaveAccessibleName(
      'segunda-feira, 2 de novembro: Ensolarado, mínima 18°C, máxima 28°C',
    );

    for (const card of cards) {
      expect(within(card).getByRole('time')).toBeInTheDocument();
      expect(within(card).getAllByText(/°C/)).toHaveLength(2);
    }
  });

  it('converts every minimum and maximum when the unit changes', () => {
    render(<ForecastList days={mockWeather.forecast} unit="fahrenheit" />);

    expect(screen.getAllByText(/°F/)).toHaveLength(10);
    expect(screen.getByText('81°F')).toBeInTheDocument();
    expect(screen.getAllByText('64°F')).toHaveLength(2);
  });
});

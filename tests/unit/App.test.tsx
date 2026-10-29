import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  it('renders clearly identified demo data and five forecast cards', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: 'Pular para o conteúdo principal' })).toHaveAttribute(
      'href',
      '#main-content',
    );
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Olá, como está o tempo?' }),
    ).toBeVisible();
    expect(
      screen.getByText('Dados de demonstração · não são informações em tempo real'),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByText(/Nenhuma consulta à internet é realizada/)).toBeInTheDocument();
  });

  it('updates all displayed temperatures without changing the location or dates', async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstForecastCard = screen.getAllByRole('article')[0];
    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(within(firstForecastCard).getByText('81°F')).toBeInTheDocument();
    expect(within(firstForecastCard).getByText('64°F')).toBeInTheDocument();
    expect(screen.getAllByText(/°F/).length).toBeGreaterThan(10);
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('allows loading, empty, and error demo states and retries back to the mock', async () => {
    const user = userEvent.setup();
    render(<App />);

    const stateSelect = screen.getByRole('combobox', { name: 'Estado da interface' });
    await user.selectOptions(stateSelect, 'loading');
    expect(
      screen.getByRole('status', { name: 'Carregando previsão do tempo' }),
    ).toBeInTheDocument();

    await user.selectOptions(stateSelect, 'empty');
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum dado disponível');

    await user.selectOptions(stateSelect, 'error');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
  });
});

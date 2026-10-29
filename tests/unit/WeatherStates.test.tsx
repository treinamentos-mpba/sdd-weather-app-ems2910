import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Empty from '../../src/components/states/Empty';
import WeatherError from '../../src/components/states/Error';
import Loading from '../../src/components/states/Loading';

describe('weather display states', () => {
  it('announces loading accessibly', () => {
    render(<Loading />);

    expect(screen.getByRole('status', { name: 'Carregando previsão do tempo' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByText('Carregando previsão...')).toBeInTheDocument();
  });

  it('offers an accessible retry action after an error', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<WeatherError onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('distinguishes an empty result from a failure', () => {
    render(<Empty />);

    expect(screen.getByRole('status')).toHaveTextContent('Nenhum dado disponível');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cityFixture, weatherFixture } from '../fixtures/weather';

const { mockedSearchCities, mockedGetWeather } = vi.hoisted(() => ({
  mockedSearchCities: vi.fn(),
  mockedGetWeather: vi.fn(),
}));

vi.mock('../../src/services/weatherService', () => ({
  searchCities: mockedSearchCities,
  getWeather: mockedGetWeather,
  WeatherServiceError: class WeatherServiceError extends Error {},
}));

import { useWeather } from '../../src/hooks/useWeather';

function HookHarness() {
  const weather = useWeather();
  return (
    <div>
      <p data-testid="status">{weather.status}</p>
      <p data-testid="query">{weather.query}</p>
      <p data-testid="error">{weather.error}</p>
      <p data-testid="report">{weather.data?.city.name ?? 'sem relatório'}</p>
      <ul>
        {weather.cities.map((city) => (
          <li key={city.name}>{city.name}</li>
        ))}
      </ul>
      <button onClick={() => void weather.search('Curitiba')} type="button">
        Buscar
      </button>
      <button onClick={() => void weather.search('   ')} type="button">
        Buscar em branco
      </button>
      <button onClick={() => void weather.selectCity(cityFixture)} type="button">
        Selecionar
      </button>
      <button onClick={() => void weather.retry()} type="button">
        Repetir
      </button>
    </div>
  );
}

describe('useWeather', () => {
  beforeEach(() => {
    mockedSearchCities.mockReset();
    mockedGetWeather.mockReset();
  });

  it('keeps the idle state for a blank query without calling services', async () => {
    render(<HookHarness />);

    await act(async () => screen.getByRole('button', { name: 'Buscar em branco' }).click());

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(mockedSearchCities).not.toHaveBeenCalled();
    expect(mockedGetWeather).not.toHaveBeenCalled();
  });

  it('exposes search results for explicit selection, then loads the selected forecast', async () => {
    mockedSearchCities.mockResolvedValue([cityFixture]);
    mockedGetWeather.mockResolvedValue(weatherFixture);
    render(<HookHarness />);

    await act(async () => screen.getByRole('button', { name: 'Buscar' }).click());
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('success'));
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByTestId('report')).toHaveTextContent('sem relatório');
    expect(mockedGetWeather).not.toHaveBeenCalled();

    await act(async () => screen.getByRole('button', { name: 'Selecionar' }).click());
    await waitFor(() => expect(screen.getByTestId('report')).toHaveTextContent('São Paulo'));
    expect(mockedGetWeather).toHaveBeenCalledWith(cityFixture);
  });

  it('retries the same failed query and exposes the error message', async () => {
    mockedSearchCities
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce([cityFixture]);
    render(<HookHarness />);

    await act(async () => screen.getByRole('button', { name: 'Buscar' }).click());
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('error'));
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Ocorreu um erro inesperado. Tente novamente.',
    );
    expect(screen.getByTestId('query')).toHaveTextContent('Curitiba');

    await act(async () => screen.getByRole('button', { name: 'Repetir' }).click());
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('success'));
    expect(mockedSearchCities).toHaveBeenNthCalledWith(2, 'Curitiba');
  });

  it('retries a failed forecast for the same selected coordinates', async () => {
    mockedGetWeather
      .mockResolvedValueOnce(weatherFixture)
      .mockRejectedValueOnce(new Error('forecast failed'))
      .mockResolvedValueOnce(weatherFixture);
    render(<HookHarness />);

    await act(async () => screen.getByRole('button', { name: 'Selecionar' }).click());
    await waitFor(() => expect(screen.getByTestId('report')).toHaveTextContent('São Paulo'));
    await act(async () => screen.getByRole('button', { name: 'Selecionar' }).click());
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('error'));
    expect(screen.getByTestId('report')).toHaveTextContent('São Paulo');
    await act(async () => screen.getByRole('button', { name: 'Repetir' }).click());
    await waitFor(() => expect(screen.getByTestId('report')).toHaveTextContent('São Paulo'));
    expect(mockedGetWeather).toHaveBeenNthCalledWith(3, cityFixture);
  });

  it('does not show a previous city report if a different city forecast fails', async () => {
    mockedGetWeather
      .mockResolvedValueOnce(weatherFixture)
      .mockRejectedValueOnce(new Error('forecast failed'));

    function CityHarness() {
      const weather = useWeather();
      return (
        <>
          <p data-testid="report">{weather.data?.city.name ?? 'sem relatório'}</p>
          <button onClick={() => void weather.selectCity(cityFixture)} type="button">
            Primeira cidade
          </button>
          <button
            onClick={() =>
              void weather.selectCity({ ...cityFixture, id: cityFixture.id + 1, name: 'Recife' })
            }
            type="button"
          >
            Outra cidade
          </button>
        </>
      );
    }

    render(<CityHarness />);
    await act(async () => screen.getByRole('button', { name: 'Primeira cidade' }).click());
    await waitFor(() => expect(screen.getByTestId('report')).toHaveTextContent('São Paulo'));
    await act(async () => screen.getByRole('button', { name: 'Outra cidade' }).click());
    expect(screen.getByTestId('report')).toHaveTextContent('sem relatório');
  });

  it('ignores a stale response when a newer search has finished', async () => {
    let resolveOld: ((value: (typeof cityFixture)[]) => void) | undefined;
    let resolveNew: ((value: (typeof cityFixture)[]) => void) | undefined;
    mockedSearchCities
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOld = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveNew = resolve;
          }),
      );
    function SearchHarness() {
      const weather = useWeather();
      return (
        <>
          <p data-testid="status">{weather.status}</p>
          <ul>
            {weather.cities.map((city) => (
              <li key={city.name}>{city.name}</li>
            ))}
          </ul>
          <button onClick={() => void weather.search('old')} type="button">
            Old
          </button>
          <button onClick={() => void weather.search('new')} type="button">
            New
          </button>
        </>
      );
    }

    render(<SearchHarness />);
    screen.getByRole('button', { name: 'Old' }).click();
    screen.getByRole('button', { name: 'New' }).click();
    await act(async () => resolveNew?.([{ ...cityFixture, name: 'Nova' }]));
    await act(async () => resolveOld?.([{ ...cityFixture, name: 'Antiga' }]));

    expect(screen.getByText('Nova')).toBeInTheDocument();
    expect(screen.queryByText('Antiga')).not.toBeInTheDocument();
  });

  it('ignores a stale forecast when a newer search finishes', async () => {
    let resolveForecast: ((value: typeof weatherFixture) => void) | undefined;
    mockedGetWeather.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveForecast = resolve;
        }),
    );
    mockedSearchCities.mockResolvedValue([]);

    function ConcurrentHarness() {
      const weather = useWeather();
      return (
        <>
          <p data-testid="status">{weather.status}</p>
          <p data-testid="report">{weather.data?.city.name ?? 'sem relatório'}</p>
          <button onClick={() => void weather.selectCity(cityFixture)} type="button">
            Selecionar
          </button>
          <button onClick={() => void weather.search('Atlantis')} type="button">
            Buscar outra cidade
          </button>
        </>
      );
    }

    render(<ConcurrentHarness />);
    screen.getByRole('button', { name: 'Selecionar' }).click();
    screen.getByRole('button', { name: 'Buscar outra cidade' }).click();
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('empty'));
    await act(async () => resolveForecast?.(weatherFixture));

    expect(screen.getByTestId('status')).toHaveTextContent('empty');
    expect(screen.getByTestId('report')).toHaveTextContent('sem relatório');
  });
});

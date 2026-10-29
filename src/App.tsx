import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import Empty from './components/states/Empty';
import WeatherError from './components/states/Error';
import Loading from './components/states/Loading';
import UnitToggle from './components/UnitToggle';
import mockWeather from './data/mockWeather';
import type { TemperatureUnit } from './types/weather';

type DemoState = 'success' | 'loading' | 'error' | 'empty';

function App() {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [displayState, setDisplayState] = useState<DemoState>('success');
  const [lastSearch, setLastSearch] = useState('');

  function renderWeather() {
    if (displayState === 'loading') return <Loading />;
    if (displayState === 'error') {
      return <WeatherError onRetry={() => setDisplayState('success')} />;
    }
    if (displayState === 'empty') return <Empty />;

    return (
      <>
        <CurrentWeather city={mockWeather.city} current={mockWeather.current} unit={unit} />
        <ForecastList days={mockWeather.forecast} unit={unit} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-night-900 text-white" id="page-top">
      <a
        className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-semibold text-night-900 focus:fixed focus:left-4 focus:top-4 focus:not-sr-only focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent-400"
        href="#main-content"
      >
        Pular para o conteúdo principal
      </a>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-accent-600/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-72 h-80 w-80 rounded-full bg-sky-500/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <a
            aria-label="Weatherly, voltar ao topo"
            className="flex w-fit items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-400"
            href="#page-top"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500/20 text-accent-400">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M7 23a6 6 0 0 1 11-3 5 5 0 0 1 9 3 4 4 0 0 1-4 4H11a4 4 0 0 1-4-4Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-white">weatherly</span>
              <span className="block text-xs text-slate-400">Seu tempo, em um só lugar</span>
            </span>
          </a>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start lg:w-[min(100%,36rem)]">
            <div className="min-w-0 flex-1">
              <SearchBar onSearch={setLastSearch} />
            </div>
            <UnitToggle onChange={setUnit} unit={unit} />
          </div>
        </header>

        <main className="mt-9 sm:mt-12" id="main-content" tabIndex={-1}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-accent-400">Quinta-feira, 29 de outubro</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Olá, como está o tempo?
              </h1>
            </div>
            <p className="w-fit rounded-full border border-amber-200/15 bg-amber-200/[0.07] px-3 py-1.5 text-xs font-medium text-amber-100/90">
              Dados de demonstração · não são informações em tempo real
            </p>
          </div>

          {lastSearch && (
            <p aria-live="polite" className="mb-4 text-sm text-slate-300" role="status">
              Busca demonstrativa recebida: <span className="font-semibold">{lastSearch}</span>. Os
              dados exibidos continuam sendo exemplos.
            </p>
          )}

          {renderWeather()}

          <footer className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">
              Exemplo visual com valores fictícios. Nenhuma consulta à internet é realizada.
            </p>
            <label className="flex items-center gap-3 text-xs text-slate-400">
              <span>Estado da interface</span>
              <select
                className="rounded-lg border border-white/10 bg-night-800 px-3 py-2 text-sm text-slate-200 outline-none transition focus-visible:ring-2 focus-visible:ring-accent-400"
                onChange={(event) => setDisplayState(event.target.value as DemoState)}
                value={displayState}
              >
                <option value="success">Dados de demonstração</option>
                <option value="loading">Carregando</option>
                <option value="error">Erro</option>
                <option value="empty">Sem dados</option>
              </select>
            </label>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;

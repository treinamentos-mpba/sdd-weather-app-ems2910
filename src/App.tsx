import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Empty from './components/states/Empty';
import WeatherError from './components/states/Error';
import Loading from './components/states/Loading';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { TemperatureUnit } from './types/weather';

function App() {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const weather = useWeather();

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
              <SearchBar onSearch={weather.search} />
            </div>
            <UnitToggle onChange={setUnit} unit={unit} />
          </div>
        </header>

        <main className="mt-9 sm:mt-12" id="main-content" tabIndex={-1}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-accent-400">Previsão local</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Olá, como está o tempo?
              </h1>
            </div>
            <p className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-slate-300">
              Dados meteorológicos · Open-Meteo
            </p>
          </div>

          {weather.status === 'loading' && (
            <div className="mb-6">
              <Loading
                label={
                  weather.operation === 'search' ? 'Buscando cidades...' : 'Buscando previsão...'
                }
              />
            </div>
          )}
          {weather.status === 'error' && weather.error && (
            <div className="mb-6">
              <WeatherError message={weather.error} onRetry={weather.retry} />
            </div>
          )}
          {weather.status === 'empty' && <Empty query={weather.query} />}
          {weather.status === 'idle' && (
            <section
              aria-label="Comece uma busca"
              className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.06] px-6 py-10 text-center shadow-glass"
            >
              <p className="text-slate-300">
                Busque uma cidade e selecione uma localidade para consultar a previsão.
              </p>
            </section>
          )}

          <SearchResults cities={weather.cities} onSelect={weather.selectCity} />

          {weather.data && (
            <div aria-live="polite">
              <CurrentWeather city={weather.data.city} current={weather.data.current} unit={unit} />
              <ForecastList days={weather.data.forecast} unit={unit} />
            </div>
          )}

          <footer className="mt-8 border-t border-white/10 pt-5">
            <p className="text-xs leading-5 text-slate-400">
              Dados fornecidos pela Open-Meteo. A busca de localidades e a previsão são carregadas
              mediante solicitação.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;

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
    <div className="app-shell" id="page-top">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo principal
      </a>

      <div className="site-wrap">
        <header className="site-header">
          <a aria-label="Weatherly, voltar ao topo" className="brand-link" href="#page-top">
            <span aria-hidden="true" className="brand-icon">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Sol entre nuvens</title>
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
              <span className="brand-title">weatherly ✦</span>
              <span className="brand-tagline">Seu tempo, em um só lugar!</span>
            </span>
          </a>

          <div className="header-tools">
            <SearchBar onSearch={weather.search} />
            <UnitToggle onChange={setUnit} unit={unit} />
          </div>
        </header>

        <div aria-hidden="true" className="ticker">
          <div className="ticker-track">
            <span>✦ TEMPO BOM, VIBES MELHORES ✦</span>
            <span>☀ PREVISÃO DO SEU CANTINHO ☀</span>
            <span>✿ FEITO NA INTERNET ✿</span>
            <span>✦ TEMPO BOM, VIBES MELHORES ✦</span>
            <span>☀ PREVISÃO DO SEU CANTINHO ☀</span>
            <span>✿ FEITO NA INTERNET ✿</span>
          </div>
        </div>

        <main className="main-content" id="main-content" tabIndex={-1}>
          <div className="page-intro">
            <div>
              <p className="eyebrow">★ Previsão local ★</p>
              <h1 className="retro-heading">Olá, como está o tempo?</h1>
            </div>
            <p className="provider-badge">Dados meteorológicos · Open-Meteo</p>
          </div>

          <div aria-hidden="true" className="rainbow-divider" />

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
            <section aria-label="Comece uma busca" className="panel idle-panel">
              <p className="state-copy">
                ✧ Busque uma cidade e selecione uma localidade para consultar a previsão. ✧
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

          <div aria-hidden="true" className="rainbow-divider" />
          <footer className="site-footer">
            <p>
              ✿ Dados fornecidos pela Open-Meteo. A busca de localidades e a previsão são carregadas
              mediante solicitação. ✿
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;

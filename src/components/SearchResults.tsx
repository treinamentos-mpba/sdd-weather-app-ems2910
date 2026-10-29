import type { City } from '../types/weather';

interface SearchResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

function SearchResults({ cities, onSelect }: SearchResultsProps) {
  if (!cities.length) return null;

  return (
    <section aria-labelledby="search-results-title" className="panel">
      <h2 className="results-title" id="search-results-title">
        Selecione uma cidade
      </h2>
      <p aria-live="polite" className="results-status" role="status">
        {cities.length === 1
          ? '1 localidade encontrada.'
          : `${cities.length} localidades encontradas.`}{' '}
        Selecione uma para consultar a previsão.
      </p>
      <ul className="results-grid">
        {cities.map((city) => (
          <li key={city.id}>
            <button className="result-button" onClick={() => onSelect(city)} type="button">
              <span className="result-name">{city.name}</span>
              <span className="result-location">
                {[city.region, city.country].filter(Boolean).join(', ')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SearchResults;

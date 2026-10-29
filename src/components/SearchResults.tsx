import { useEffect, useRef } from 'react';
import type { City } from '../types/weather';

interface SearchResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

function SearchResults({ cities, onSelect }: SearchResultsProps) {
  const firstResultRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cities.length) return;
    const activeElement = document.activeElement;
    if (
      activeElement === document.body ||
      (activeElement instanceof HTMLElement &&
        activeElement.closest('form[role="search"], [role="alert"]'))
    ) {
      firstResultRef.current?.focus();
    }
  }, [cities.length]);

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
        {cities.map((city, index) => (
          <li key={city.id}>
            <button
              className="result-button"
              onClick={() => onSelect(city)}
              ref={index === 0 ? firstResultRef : undefined}
              type="button"
            >
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

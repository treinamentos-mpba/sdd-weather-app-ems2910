import type { City } from '../types/weather';

interface SearchResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

function SearchResults({ cities, onSelect }: SearchResultsProps) {
  if (!cities.length) return null;

  return (
    <section
      aria-labelledby="search-results-title"
      className="mb-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-glass"
    >
      <h2 className="mb-3 text-sm font-semibold text-slate-200" id="search-results-title">
        Selecione uma cidade
      </h2>
      <p aria-live="polite" className="mb-3 text-sm text-slate-300" role="status">
        {cities.length === 1
          ? '1 localidade encontrada.'
          : `${cities.length} localidades encontradas.`}{' '}
        Selecione uma para consultar a previsão.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <li key={city.id}>
            <button
              className="w-full rounded-xl border border-white/10 bg-night-800/70 px-4 py-3 text-left transition hover:border-accent-400/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
              onClick={() => onSelect(city)}
              type="button"
            >
              <span className="block font-medium text-white">{city.name}</span>
              <span className="mt-1 block text-sm text-slate-400">
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

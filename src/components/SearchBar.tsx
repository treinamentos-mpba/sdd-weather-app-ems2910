import { type FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError('Digite o nome de uma cidade para buscar.');
      return;
    }

    setError('');
    onSearch(trimmedQuery);
  }

  return (
    <form aria-label="Buscar cidade" className="w-full" onSubmit={handleSubmit} role="search">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 shadow-inner shadow-black/10 transition focus-within:border-accent-400 focus-within:ring-2 focus-within:ring-accent-400/80">
        <label className="sr-only" htmlFor="city-search">
          Buscar cidade
        </label>
        <svg
          aria-hidden="true"
          className="ml-3 h-5 w-5 shrink-0 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
          <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
        <input
          aria-describedby={error ? 'search-error' : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-white outline-none placeholder:text-slate-400"
          id="city-search"
          onChange={(event) => {
            setQuery(event.target.value);
            if (error) setError('');
          }}
          placeholder="Buscar cidade..."
          type="search"
          value={query}
        />
        <button
          className="shrink-0 rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
          type="submit"
        >
          Buscar
        </button>
      </div>
      {error && (
        <p className="mt-2 px-2 text-sm text-rose-300" id="search-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default SearchBar;

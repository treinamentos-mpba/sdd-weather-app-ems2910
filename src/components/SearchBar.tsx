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
    <form aria-label="Buscar cidade" className="search-form" onSubmit={handleSubmit} role="search">
      <div className="search-control">
        <label className="sr-only" htmlFor="city-search">
          Buscar cidade
        </label>
        <svg
          aria-hidden="true"
          className="search-icon"
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
          className="search-input"
          id="city-search"
          onChange={(event) => {
            setQuery(event.target.value);
            if (error) setError('');
          }}
          placeholder="Buscar cidade..."
          type="search"
          value={query}
        />
        <button className="geo-button" type="submit">
          Buscar
        </button>
      </div>
      {error && (
        <p className="search-error" id="search-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default SearchBar;

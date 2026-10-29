import { useRef, useState } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

type Operation = { type: 'search'; query: string } | { type: 'select'; city: City };

interface WeatherState {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  operation: 'search' | 'forecast' | null;
}

const initialState: WeatherState = {
  status: 'idle',
  data: null,
  cities: [],
  error: null,
  query: '',
  operation: null,
};

function getErrorMessage(error: unknown): string {
  return error instanceof WeatherServiceError
    ? error.message
    : 'Ocorreu um erro inesperado. Tente novamente.';
}

export function useWeather() {
  const [state, setState] = useState(initialState);
  const requestId = useRef(0);
  const lastOperation = useRef<Operation | null>(null);

  async function search(query: string): Promise<void> {
    const normalizedQuery = query.trim();
    const operationId = ++requestId.current;
    if (normalizedQuery) {
      lastOperation.current = { type: 'search', query: normalizedQuery };
    } else {
      lastOperation.current = null;
    }
    setState((previous) => ({
      ...previous,
      query: normalizedQuery,
      status: normalizedQuery ? 'loading' : 'idle',
      cities: [],
      error: null,
      operation: normalizedQuery ? 'search' : null,
    }));

    if (!normalizedQuery) return;

    try {
      const cities = await searchCities(normalizedQuery);
      if (operationId !== requestId.current) return;
      setState((previous) => ({
        ...previous,
        cities,
        error: null,
        status: cities.length ? 'success' : 'empty',
        operation: null,
      }));
    } catch (error: unknown) {
      if (operationId !== requestId.current) return;
      setState((previous) => ({
        ...previous,
        error: getErrorMessage(error),
        status: 'error',
        operation: null,
      }));
    }
  }

  async function selectCity(city: City): Promise<void> {
    const operationId = ++requestId.current;
    lastOperation.current = { type: 'select', city };
    setState((previous) => ({
      ...previous,
      data: previous.data?.city.id === city.id ? previous.data : null,
      status: 'loading',
      error: null,
      operation: 'forecast',
    }));

    try {
      const data = await getWeather(city);
      if (operationId !== requestId.current) return;
      setState((previous) => ({
        ...previous,
        data,
        error: null,
        status: 'success',
        operation: null,
      }));
    } catch (error: unknown) {
      if (operationId !== requestId.current) return;
      setState((previous) => ({
        ...previous,
        error: getErrorMessage(error),
        status: 'error',
        operation: null,
      }));
    }
  }

  function retry(): Promise<void> {
    const operation = lastOperation.current;
    if (!operation) return Promise.resolve();
    return operation.type === 'search' ? search(operation.query) : selectCity(operation.city);
  }

  return {
    ...state,
    search,
    selectCity,
    retry,
  };
}

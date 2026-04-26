/**
 * Custom React Hooks
 * 
 * Reusable hooks for common patterns across features.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError, getErrorMessage } from '../utils/httpClient';

/**
 * State for API requests
 */
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * useApi Hook
 * 
 * Handles loading, error, and data state for API calls.
 * 
 * @example
 * const { data, loading, error, execute } = useApi(
 *   () => flashcardsApi.getFlashcards(fileId)
 * );
 * 
 * useEffect(() => {
 *   execute();
 * }, []);
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  autoExecute: boolean = false
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  }, [apiFunction]);

  useEffect(() => {
    if (autoExecute) {
      execute();
    }
  }, [autoExecute, execute]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * useLocalStorage Hook
 * 
 * Sync state with localStorage.
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * useDebounce Hook
 * 
 * Debounce a value (useful for search inputs).
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * useEffect(() => {
 *   // API call with debouncedSearch
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useAsync Hook
 * 
 * Execute async functions with loading/error state.
 * 
 * @example
 * const { execute, loading, error } = useAsync(async () => {
 *   await authApi.login(email, password);
 * });
 * 
 * const handleSubmit = () => execute();
 */
export function useAsync<T = void>(
  asyncFunction: () => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      if (isMountedRef.current) {
        setLoading(false);
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setLoading(false);
      }
      throw err;
    }
  }, [asyncFunction]);

  return { execute, loading, error };
}

/**
 * usePrevious Hook
 * 
 * Get previous value of a state/prop.
 * 
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * useToggle Hook
 * 
 * Boolean state with toggle function.
 * 
 * @example
 * const [isOpen, toggleOpen] = useToggle(false);
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle, setValue];
}

/**
 * useInterval Hook
 * 
 * setInterval with React lifecycle management.
 * 
 * @example
 * useInterval(() => {
 *   // Fetch new data every 5 seconds
 *   refetch();
 * }, 5000);
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * useOnClickOutside Hook
 * 
 * Detect clicks outside an element.
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useOnClickOutside(ref, () => setIsOpen(false));
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

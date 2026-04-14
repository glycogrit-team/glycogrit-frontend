/**
 * Custom hook for debouncing values
 */

import { useState, useEffect } from 'react';
import { UIConfig } from '../lib/config';

/**
 * Hook to debounce a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (defaults to UIConfig.SEARCH_DEBOUNCE)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = UIConfig.SEARCH_DEBOUNCE): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

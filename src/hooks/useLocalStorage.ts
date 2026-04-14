/**
 * Custom hook for managing localStorage with type safety
 */

import { useState, useEffect } from 'react';
import { logError } from '../lib/errors';

/**
 * Hook to manage localStorage with React state
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logError(error, { key, context: 'useLocalStorage-read' });
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      logError(error, { key, context: 'useLocalStorage-write' });
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook to remove an item from localStorage
 */
export function useRemoveLocalStorage(key: string): () => void {
  return () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      logError(error, { key, context: 'useRemoveLocalStorage' });
    }
  };
}

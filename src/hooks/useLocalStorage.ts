import { useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue?: T) {
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  const [value, setValue] = useState<T | null | undefined>(readValue);

  const setLocalStorageValue = (newValue: T | null) => {
    if (!newValue) {
    localStorage.removeItem(key);
      setValue(newValue);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    }
  };
  return { value, setLocalStorageValue };
}

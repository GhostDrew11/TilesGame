import { useCallback, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Simulate checking loaclStorage
      const item = window.memoryGameStorage?.[key];
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading storage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        //Simualate saving to localStorage
        if (!window.memoryGameStorage) {
          window.memoryGameStorage = {};
        }
        window.memoryGameStorage[key] = JSON.stringify(valueToStore);
      } catch (error) {
        console.error(`Error setting storage key "${key}"`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
};

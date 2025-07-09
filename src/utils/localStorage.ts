export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    window.gameStorage = window.gameStorage || {};
    window.gameStorage[key] = JSON.stringify(data);
  } catch (error) {
    console.warn("Could not save to storage:", error);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storage = window.gameStorage || {};
    const item = storage[key];
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.warn("Could not load from storage:", error);
    return defaultValue;
  }
};

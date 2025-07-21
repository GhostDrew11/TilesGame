export {};

declare global {
  interface Window {
    memoryGameStorage?: Record<string, string>;
  }
}

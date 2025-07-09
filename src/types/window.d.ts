export {};

declare global {
  interface Window {
    gameStorage?: Record<string, string>;
  }
}

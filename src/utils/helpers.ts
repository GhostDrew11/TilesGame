import type { Tile } from "../types/game";

export const shuffleArray = (tiles: Tile[]): Tile[] => {
  const result = [...tiles];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

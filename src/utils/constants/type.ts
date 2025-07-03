export interface Tile {
  id: number;
  value: string;
  isRevealed: boolean;
  isMatched: boolean;
}

export interface GameStats {
  tilesClicked: number;
  matches: number;
}

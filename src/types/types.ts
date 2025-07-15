export type GamePhase = "setup" | "study" | "play" | "results";
export type TileState = "hidden" | "revealed" | "matched";
export type GameDifficulty = "easy" | "medium" | "hard";

export interface Tile {
  id: number;
  value: string;
  state: TileState;
  pairId: number;
}

export interface GameStats {
  tilesClicked: number;
  matches: number;
  timeElapsed: number;
  phase: GamePhase;
  score: number;
}

export interface GameConfig {
  studyTimeSeconds: number;
  playTimeSeconds: number;
  gridSize: number;
  difficulty: GameDifficulty;
}

export interface HighScore {
  score: number;
  matches: number;
  timeElapsed: number;
  difficulty: GameDifficulty;
  date: string;
}

export type GamePhase = "config" | "study" | "play" | "paused" | "results";
export type TileState = "hidden" | "revealed" | "matched" | "mismatched";
export type SoundType = "flip" | "match" | "mismatch" | "win" | "lose";

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  EXPERT = "expert",
}
export interface Tile {
  id: number;
  value: string;
  emoji: string;
  state: TileState;
  pairId: number;
  animationDelay?: number;
}
export interface GameConfig {
  difficulty: Difficulty;
  studyTimeSeconds: number;
  playTimeSeconds: number;
  gridSize: number;
  enableSound: boolean;
  enableAnimation: boolean;
  theme: "default" | "dark" | "colorful";
}

export interface GameStats {
  tilesClicked: number;
  matches: number;
  mismatches: number;
  timeElapsed: number;
  phase: GamePhase;
  score: number;
  accuracy: number;
}

export interface HighScore {
  id: string;
  playerName: string;
  score: number;
  accuracy: number;
  difficulty: Difficulty;
  date: string;
  timeElapsed: number;
}

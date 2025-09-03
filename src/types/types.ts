export type GamePhase = "setup" | "study" | "play" | "paused" | "results";
export type TileState = "hidden" | "revealed" | "matched" | "mismatched";
export type GameDifficulty = "easy" | "medium" | "hard";
export type GameTheme = "default" | "dark" | "colorful";
export type SoundType =
  | "flip"
  | "match"
  | "mismatch"
  | "win"
  | "lose"
  | "streak";

export interface Tile {
  id: number;
  value: string;
  state: TileState;
  pairId: number;
  animationDelay?: number;
}

export interface GameStats {
  tilesClicked: number;
  matches: number;
  mismatches: number;
  timeElapsed: number;
  phase: GamePhase;
  score: number;
  accuracy: number;
  streak: number;
  maxStreak: number;
}
export interface GameConfig {
  studyTimeSeconds: number;
  playTimeSeconds: number;
  gridSize: number;
  difficulty: GameDifficulty;
  enableSound: boolean;
  enableAnimations: boolean;
  theme: GameTheme;
}

export interface HighScore {
  score: number;
  matches: number;
  accuracy: number;
  timeElapsed: number;
  difficulty: GameDifficulty;
  maxStreak: number;
  date: string;
}

export interface ScoreBreakdown {
  baseScore: number;
  efficiencyBonus: number;
  streakBonus: number;
  timeBonus: number;
  difficultyMultiplier: number;
  finalScore: number;
}

export interface ThemeConfig {
  background: string;
  cardBackground: string;
  textColor: string;
  primaryColor: string;
  successColor: string;
  errorColor: string;
  tileHidden: string;
  tileRevealed: string;
  tileMatched: string;
  tileMismatched: string;
}

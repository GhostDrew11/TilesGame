type GamePhase = "study" | "play" | "results";
type TileState = "hidden" | "revealed" | "matched";

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
}

export interface GameConfig {
  studyTimeSeconds: number;
  playTimeSeconds: number;
  gridSize: number;
}

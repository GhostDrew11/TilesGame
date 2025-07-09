import { Difficulty } from "../types/types";

export const difficultySettings = {
  [Difficulty.EASY]: { gridSize: 8, studyTime: 20, playTime: 120, pairs: 4 },
  [Difficulty.MEDIUM]: { gridSize: 12, studyTime: 15, playTime: 90, pairs: 6 },
  [Difficulty.HARD]: { gridSize: 16, studyTime: 10, playTime: 60, pairs: 8 },
  [Difficulty.EXPERT]: { gridSize: 20, studyTime: 8, playTime: 45, pairs: 10 },
};

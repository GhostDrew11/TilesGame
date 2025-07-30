import type { GameTheme, ThemeConfig } from "../types/types";

export const emojiSets = {
  easy: ["🎮", "🎯", "🎪", "🎨"],
  medium: ["🎮", "🎯", "🎪", "🎨", "🎭", "🎲"],
  hard: ["🎮", "🎯", "🎪", "🎨", "🎭", "🎲", "🎸", "🎹"],
  expert: ["🎮", "🎯", "🎪", "🎨", "🎭", "🎲", "🎸", "🎹", "🎵", "🎧"],
};

export const themes: Record<GameTheme, ThemeConfig> = {
  default: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    cardBackground: "rgba(255, 255, 255, 0.95)",
    textColor: "#333",
    primaryColor: "#667eea",
    successColor: "#10b981",
    errorColor: "#ef4444",
    tileHidden: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
    tileRevealed: "linear-gradient(135deg, #667eea, #764ba2)",
    tileMatched: "linear-gradient(135deg, #10b981, #059669)",
    tileMismatched: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
  dark: {
    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    cardBackground: "rgba(31, 41, 55, 0.95)",
    textColor: "#f9fafb",
    primaryColor: "#8b5cf6",
    successColor: "#059669",
    errorColor: "#dc2626",
    tileHidden: "linear-gradient(135deg, #374151, #4b5563)",
    tileRevealed: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    tileMatched: "linear-gradient(135deg, #059669, #047857)",
    tileMismatched: "linear-gradient(135deg, #dc2626, #b91c1c)",
  },
  colorful: {
    background:
      "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)",
    cardBackground: "rgba(255, 255, 255, 0.9)",
    textColor: "#2d3748",
    primaryColor: "#ff6b6b",
    successColor: "#4ecdc4",
    errorColor: "#ff8a80",
    tileHidden: "linear-gradient(135deg, #fff, #f1f5f9)",
    tileRevealed: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
    tileMatched: "linear-gradient(135deg, #4ecdc4, #44a5a5)",
    tileMismatched: "linear-gradient(135deg, #ff8a80, #ff5722)",
  },
};

import { useCallback, useEffect, useState } from "react";
import type {
  GameStats,
  GameConfig,
  Tile,
  TileState,
  Difficulty,
  HighScore,
} from "../types/types";
import { shuffleArray } from "../utils/helpers";
import { SoundManager } from "../types/SoundManager";
import { difficultySettings } from "../constants/difficultySettings";
import { emojiSets } from "../constants/constants";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";
import { HIGHSCORES_KEY } from "../constants/storageKeys";

export const useMemoryGame = (config: GameConfig) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    tilesClicked: 0,
    matches: 0,
    mismatches: 0,
    timeElapsed: 0,
    phase: "config",
    score: 0,
    accuracy: 0,
  });
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundManager] = useState(() => new SoundManager());

  // Update sound manager when config changes
  useEffect(() => {
    soundManager.setEnabled(config?.enableSound);
  }, [soundManager, config?.enableSound]);

  const calculateScore = useCallback(
    (
      matches: number,
      mismatches: number,
      timeElapsed: number,
      difficulty: Difficulty
    ) => {
      const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2,
        expert: 2.5,
      }[difficulty];
      const baseScore = matches * 100 * difficultyMultiplier;
      const timePenalty = timeElapsed * 2;
      const mismatchPenalty = mismatches * 10;

      return Math.max(0, Math.round(baseScore - timePenalty - mismatchPenalty));
    },
    []
  );

  const calculateAccuracy = useCallback(
    (matches: number, totalClicks: number) => {
      if (totalClicks === 0) return 0;
      return Math.round(((matches * 2) / totalClicks) * 100);
    },
    []
  );

  // Create pairs
  const initializeTiles = useCallback(() => {
    const setting = difficultySettings[config.difficulty];
    const emojiSet = emojiSets[config.difficulty];
    const pairs: Tile[] = [];

    for (let i = 0; i < setting.pairs; i++) {
      const emoji = emojiSet[i];
      const pairId = i;

      pairs.push(
        {
          id: i * 2,
          value: `${emoji}-1`,
          emoji,
          state: "revealed",
          pairId,
          animationDelay: Math.random() * 0.5,
        },
        {
          id: i * 2 + 1,
          value: `${emoji}-2`,
          emoji,
          state: "revealed",
          pairId,
          animationDelay: Math.random() * 0.5,
        }
      );
    }

    // Fill the remaining slots with hidden tiles for larger grids
    while (pairs.length < setting.gridSize) {
      pairs.push({
        id: pairs.length,
        value: "",
        emoji: "",
        state: "hidden",
        pairId: -1,
        animationDelay: 0,
      });
    }
    // Shuffle the pairs
    const shuffled = shuffleArray(pairs);
    setTiles(shuffled);
  }, [config.difficulty]);

  // Handle phase transitions
  const startStudyPhase = useCallback(() => {
    setGameStats((prev) => ({ ...prev, phase: "study" }));
    initializeTiles();
  }, [initializeTiles]);

  const startPlayPhase = useCallback(() => {
    setTiles((prev) =>
      prev.map((tile) =>
        tile.pairId >= 0 ? { ...tile, state: "hidden" as TileState } : tile
      )
    );
    setGameStats((prev) => ({ ...prev, phase: "play" }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameStats((prev) => ({ ...prev, phase: "paused" }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameStats((prev) => ({ ...prev, phase: "play" }));
  }, []);

  const endGame = useCallback(() => {
    const finalScore = calculateScore(
      gameStats.matches,
      gameStats.mismatches,
      gameStats.timeElapsed,
      config.difficulty
    );
    const accuracy = calculateAccuracy(
      gameStats.matches,
      gameStats.tilesClicked
    );

    setGameStats((prev) => ({
      ...prev,
      phase: "results",
      score: finalScore,
      accuracy,
    }));

    // Save high score
    const highScore: HighScore = {
      id: Date.now().toString(),
      playerName: "Player",
      score: finalScore,
      accuracy,
      difficulty: config.difficulty,
      date: new Date().toISOString(),
      timeElapsed: gameStats.timeElapsed,
    };

    const existingScores = loadFromStorage(HIGHSCORES_KEY, []);
    const newScores = [...existingScores, highScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    saveToStorage(HIGHSCORES_KEY, newScores);

    soundManager.play(
      gameStats.matches >= difficultySettings[config.difficulty].pairs
        ? "win"
        : "lose"
    );
  }, [
    gameStats,
    config.difficulty,
    calculateAccuracy,
    calculateScore,
    soundManager,
  ]);

  // Handle tile clicks
  const handleTileClick = useCallback(
    (tileId: number) => {
      if (
        gameStats.phase !== "play" ||
        selectedTiles.length >= 2 ||
        isAnimating
      )
        return;

      const tile = tiles.find((t) => t.id === tileId);
      if (!tile || tile.state !== "hidden" || tile.pairId < 0) return;

      soundManager.play("flip");

      // Reveal the clicked Tile
      setTiles((prev) =>
        prev.map((t) =>
          t.id === tileId ? { ...t, state: "revealed" as TileState } : t
        )
      );

      const newSelectedTiles = [...selectedTiles, tileId];
      setSelectedTiles(newSelectedTiles);

      // Update game stats
      setGameStats((prev) => ({
        ...prev,
        tilesClicked: prev.tilesClicked + 1,
        timeElapsed: prev.timeElapsed + 1,
      }));

      // Check for match when two tiles are selected
      if (newSelectedTiles.length === 2) {
        const [firstId, secondId] = newSelectedTiles;
        const firstTile = tiles.find((t) => t.id === firstId);
        const secondTile = tiles.find((t) => t.id === secondId);

        setTimeout(() => {
          if (
            firstTile &&
            secondTile &&
            firstTile.pairId === secondTile.pairId
          ) {
            // Match found
            setTiles((prev) =>
              prev.map((t) =>
                t.id === firstId || t.id === secondId
                  ? { ...t, state: "matched" as TileState }
                  : t
              )
            );
            setGameStats((prev) => ({
              ...prev,
              matches: prev.matches + 1,
              score: calculateScore(
                prev.matches + 1,
                prev.mismatches,
                prev.timeElapsed,
                config.difficulty
              ),
            }));
          } else {
            //No match - hide tiles
            setTiles((prev) =>
              prev.map((t) =>
                t.id === firstId || t.id === secondId
                  ? { ...t, state: "hidden" as TileState }
                  : t
              )
            );
            setGameStats((prev) => ({
              ...prev,
              mismatches: prev.mismatches + 1,
              score: calculateScore(
                prev.matches,
                prev.mismatches + 1,
                prev.timeElapsed,
                config.difficulty
              ),
            }));

            // Hide tiles after a mismatch
            setTimeout(() => {
              setTiles((prev) =>
                prev.map((t) =>
                  t.id === firstId || t.id === secondId
                    ? { ...t, state: "hidden" as TileState }
                    : t
                )
              );
            }, 1000);
          }

          setSelectedTiles([]);
          setIsAnimating(false);
        }, 1000);
      }
    },
    [
      tiles,
      selectedTiles,
      gameStats.phase,
      isAnimating,
      soundManager,
      calculateScore,
      config.difficulty,
    ]
  );

  // Reset Game
  const resetGame = useCallback(() => {
    setGameStats({
      tilesClicked: 0,
      matches: 0,
      mismatches: 0,
      timeElapsed: 0,
      phase: "config",
      score: 0,
      accuracy: 0,
    });
    setSelectedTiles([]);
    setTiles([]);
    initializeTiles();
    setIsAnimating(false);
  }, [initializeTiles]);

  return {
    tiles,
    gameStats,
    selectedTiles,
    isAnimating,
    handleTileClick,
    startStudyPhase,
    startPlayPhase,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    initializeTiles,
  };
};

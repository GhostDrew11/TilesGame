import { useCallback, useEffect, useState } from "react";
import type {
  GameStats,
  GameConfig,
  Tile,
  TileState,
  GameDifficulty,
  ScoreBreakdown,
} from "../types/types";
import { shuffleArray } from "../utils/helpers";
import { SoundManager } from "../types/SoundManager";

export const useMemoryGame = (config: GameConfig) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    tilesClicked: 0,
    matches: 0,
    mismatches: 0,
    timeElapsed: 0,
    phase: "setup",
    score: 0,
    accuracy: 0,
    streak: 0,
    maxStreak: 0,
  });
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [soundManager] = useState(() => new SoundManager());

  // Update sound manager when config changes
  useEffect(() => {
    soundManager.setEnabled(config.enableSound);
  }, [config.enableSound, soundManager]);

  // Generate tile symbols based on difficulty
  const getTileSymbols = useCallback((difficulty: GameDifficulty): string[] => {
    const symbols = {
      easy: ["🎮", "🎯", "🎪", "🎨"],
      medium: ["🎮", "🎯", "🎪", "🎨", "🎭", "🎲"],
      hard: ["🎮", "🎯", "🎪", "🎨", "🎭", "🎲", "🎸", "🎺"],
    };
    return symbols[difficulty];
  }, []);

  // Initialize tiles based on configuration
  const initializeTiles = useCallback(() => {
    const symbols = getTileSymbols(config.difficulty);
    const pairs: Tile[] = [];
    const pairCount = config.gridSize / 2;

    for (let i = 0; i < pairCount; i++) {
      const symbol = symbols[i % symbols.length];
      pairs.push(
        {
          id: i * 2,
          value: symbol,
          state: "revealed",
          pairId: i,
          animationDelay: config.enableAnimations ? Math.random() * 0.5 : 0,
        },
        {
          id: i * 2 + 1,
          value: symbol,
          state: "revealed",
          pairId: i,
          animationDelay: config.enableAnimations ? Math.random() * 0.5 : 0,
        }
      );
    }

    // Shuffle the pairs
    const shuffled = shuffleArray(pairs);
    setTiles(shuffled);
  }, [
    config.difficulty,
    config.gridSize,
    config.enableAnimations,
    getTileSymbols,
  ]);

  // Enhanced scoring calculations (Day 5 Hybrid System)
  const calculateEstimatedScore = useCallback(
    (
      matches: number,
      clicks: number,
      streak: number,
      difficulty: GameDifficulty
    ): number => {
      const baseScore = matches * 100;
      const efficiency = clicks > 0 ? (matches * 2) / clicks : 0;
      const streakBonus = streak > 1 ? (streak - 1) * 25 : 0;
      const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[
        difficulty
      ];

      return Math.round(
        (baseScore + streakBonus) * efficiency * difficultyMultiplier
      );
    },
    []
  );

  const calculateFinalScore = useCallback(
    (
      matches: number,
      clicks: number,
      maxStreak: number,
      timeRemaining: number,
      difficulty: GameDifficulty
    ): ScoreBreakdown => {
      const baseScore = matches * 100;
      const efficiency = clicks > 0 ? (matches * 2) / clicks : 0;
      const efficiencyBonus = Math.round(baseScore * (efficiency - 1));
      const streakBonus = maxStreak > 1 ? (maxStreak - 1) * 50 : 0;
      const timeBonus = Math.max(0, timeRemaining * 5);
      const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[
        difficulty
      ];

      const subtotal = baseScore + efficiencyBonus + streakBonus + timeBonus;
      const finalScore = Math.round(subtotal * difficultyMultiplier);

      return {
        baseScore,
        efficiencyBonus,
        streakBonus,
        timeBonus,
        difficultyMultiplier,
        finalScore,
      };
    },
    []
  );

  // Calculate Accuracy
  const calculateAccuracy = useCallback(
    (matches: number, totalClicks: number): number => {
      if (totalClicks === 0) return 0;
      return Math.round(((matches * 2) / totalClicks) * 100);
    },
    []
  );

  // Handle phase transitions
  const startStudyPhase = useCallback(() => {
    setGameStats((prev) => ({ ...prev, phase: "study" }));
    initializeTiles();
  }, [initializeTiles]);

  const startPlayPhase = useCallback(() => {
    setTiles((prev) =>
      prev.map((tile) => ({ ...tile, state: "hidden" as TileState }))
    );
    setGameStats((prev) => ({ ...prev, phase: "play" }));
  }, []);

  // Pause/Resume functions
  const pauseGame = useCallback(() => {
    setGameStats((prev) => ({ ...prev, phase: "paused" }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameStats((prev) => ({ ...prev, phase: "play" }));
  }, []);

  const endGame = useCallback(
    (timeRemaining: number = 0) => {
      const scoreBreakdown = calculateFinalScore(
        gameStats.matches,
        gameStats.tilesClicked,
        gameStats.maxStreak,
        timeRemaining,
        config.difficulty
      );
      const accuracy = calculateAccuracy(
        gameStats.matches,
        gameStats.tilesClicked
      );

      setGameStats((prev) => ({
        ...prev,
        phase: "results",
        score: scoreBreakdown.finalScore,
        accuracy,
      }));

      // Play win/lose sound
      const totalPairs = config.gridSize / 2;
      soundManager.play(gameStats.matches >= totalPairs ? "win" : "lose");

      // Return high score object for parent component to handle
      return {
        score: scoreBreakdown.finalScore,
        matches: gameStats.matches,
        accuracy,
        timeElapsed: gameStats.tilesClicked,
        difficulty: config.difficulty,
        maxStreak: gameStats.maxStreak,
        date: new Date().toLocaleDateString(),
        breakdown: scoreBreakdown,
      };
    },
    [
      calculateFinalScore,
      gameStats.matches,
      gameStats.tilesClicked,
      gameStats.maxStreak,
      config.difficulty,
      config.gridSize,
      calculateAccuracy,
      soundManager,
    ]
  );

  // Handle tile clicks with enhanced feedback
  const handleTileClick = useCallback(
    (tileId: number) => {
      if (gameStats.phase !== "play" || selectedTiles.length >= 2) return;

      const tile = tiles.find((t) => t.id === tileId);
      if (!tile || tile.state !== "hidden") return;

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

            setGameStats((prev) => {
              const newMatches = prev.matches + 1;
              const newStreak = prev.streak + 1;
              const newMaxStreak = Math.max(prev.maxStreak, newStreak);
              const estimatedScore = calculateEstimatedScore(
                newMatches,
                prev.tilesClicked,
                newStreak,
                config.difficulty
              );
              const accuracy = calculateAccuracy(newMatches, prev.tilesClicked);

              // Play streak sound for streaks > 2
              if (newStreak > 2) {
                soundManager.play("streak");
              } else {
                soundManager.play("match");
              }

              return {
                ...prev,
                matches: newMatches,
                streak: newStreak,
                maxStreak: newMaxStreak,
                score: estimatedScore,
                accuracy,
              };
            });
          } else {
            //No match - show mismatch state temporarily
            setTiles((prev) =>
              prev.map((t) =>
                t.id === firstId || t.id === secondId
                  ? { ...t, state: "mismatched" as TileState }
                  : t
              )
            );

            setGameStats((prev) => {
              const accuracy = calculateAccuracy(
                prev.matches,
                prev.tilesClicked
              );
              return {
                ...prev,
                mismatches: prev.mismatches + 1,
                streak: 0, // Reset streak on mismatch
                accuracy,
              };
            });

            soundManager.play("mismatch");

            // Hide tiles after showing mismatch
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
        }, 1000);
      }
    },
    [
      tiles,
      selectedTiles,
      gameStats.phase,
      soundManager,
      calculateAccuracy,
      calculateEstimatedScore,
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
      phase: "setup",
      score: 0,
      accuracy: 0,
    });
    setSelectedTiles([]);
    setTiles([]);
    initializeTiles();
  }, [initializeTiles]);

  return {
    tiles,
    gameStats,
    selectedTiles,
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

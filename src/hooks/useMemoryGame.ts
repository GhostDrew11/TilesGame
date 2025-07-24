import { useCallback, useState } from "react";
import type {
  GameStats,
  GameConfig,
  Tile,
  TileState,
  GameDifficulty,
} from "../types/types";
import { shuffleArray } from "../utils/helpers";

export const useMemoryGame = (config: GameConfig) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    tilesClicked: 0,
    matches: 0,
    timeElapsed: 0,
    phase: "setup",
    score: 0,
  });
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);

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
        },
        {
          id: i * 2 + 1,
          value: symbol,
          state: "revealed",
          pairId: i,
        }
      );
    }

    // Shuffle the pairs
    const shuffled = shuffleArray(pairs);
    setTiles(shuffled);
  }, [config.difficulty, config.gridSize, getTileSymbols]);

  // Calculate score based on difficulty and performance
  const calculateScore = useCallback(
    (matches: number, clicks: number, difficulty: GameDifficulty): number => {
      const baseScore = matches * 100;
      const efficiency = (matches * 2) / Math.max(clicks, 1);
      const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[
        difficulty
      ];

      return Math.round(baseScore * efficiency * difficultyMultiplier);
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

  const endGame = useCallback(() => {
    const finalScore = calculateScore(
      gameStats.matches,
      gameStats.tilesClicked,
      config.difficulty
    );
    setGameStats((prev) => ({ ...prev, phase: "results", score: finalScore }));

    return {
      score: finalScore,
      matches: gameStats.matches,
      timeElapsed: gameStats.tilesClicked,
      difficulty: config.difficulty,
      date: new Date().toLocaleDateString(),
    };
  }, [
    gameStats.matches,
    gameStats.tilesClicked,
    config.difficulty,
    calculateScore,
  ]);

  // Handle tile clicks with enhanced feedback
  const handleTileClick = useCallback(
    (tileId: number) => {
      if (gameStats.phase !== "play" || selectedTiles.length >= 2) return;

      const tile = tiles.find((t) => t.id === tileId);
      if (!tile || tile.state !== "hidden") return;

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
            setGameStats((prev) => ({
              ...prev,
              matches: prev.matches + 1,
              score: calculateScore(
                prev.matches + 1,
                prev.tilesClicked,
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
          }

          setSelectedTiles([]);
        }, 1000);
      }
    },
    [tiles, selectedTiles, gameStats.phase, calculateScore, config.difficulty]
  );

  // Reset Game
  const resetGame = useCallback(() => {
    setGameStats({
      tilesClicked: 0,
      matches: 0,
      timeElapsed: 0,
      phase: "setup",
      score: 0,
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
    endGame,
    resetGame,
    initializeTiles,
  };
};

import { useCallback, useState } from "react";
import type { GameStats, GameConfig, Tile, TileState } from "../types/types";
import { shuffleArray } from "../utils/helpers";

export const useMemoryGame = (config: GameConfig) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    tilesClicked: 0,
    matches: 0,
    timeElapsed: 0,
    phase: "study",
  });
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);

  // Create pairs
  const initializeTiles = useCallback(() => {
    const symbols = ["🎮", "🎯", "🎪", "🎨", "🎭", "🐨", "🎲", "🎸"];
    const pairs: Tile[] = [];

    for (let i = 0; i < config.gridSize / 2; i++) {
      const symbol = symbols[i % symbols.length];
      pairs.push(
        { id: i * 2, value: symbol, state: "revealed", pairId: i },
        { id: i * 2 + 1, value: symbol, state: "revealed", pairId: i }
      );
    }

    // Shuffle the pairs
    const shuffled = shuffleArray(pairs);
    setTiles(shuffled);
  }, [config.gridSize]);

  // Handle phase transitions
  const startPlayPhase = useCallback(() => {
    setTiles((prev) =>
      prev.map((tile) => ({ ...tile, state: "hidden" as TileState }))
    );
    setGameStats((prev) => ({ ...prev, phase: "play" }));
  }, []);

  const endGame = useCallback(() => {
    setGameStats((prev) => ({ ...prev, phase: "results" }));
  }, []);

  // Handle tile clicks
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
            setGameStats((prev) => ({ ...prev, matches: prev.matches + 1 }));
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
    [tiles, selectedTiles, gameStats.phase]
  );

  // Reset Game
  const resetGame = useCallback(() => {
    setGameStats({
      tilesClicked: 0,
      matches: 0,
      timeElapsed: 0,
      phase: "study",
    });
    setSelectedTiles([]);
    initializeTiles();
  }, [initializeTiles]);

  return {
    tiles,
    gameStats,
    setGameStats,
    selectedTiles,
    handleTileClick,
    startPlayPhase,
    endGame,
    resetGame,
    initializeTiles,
  };
};

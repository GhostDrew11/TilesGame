import { useCallback, useEffect } from "react";
import "../MemoryGame.css";
import TileComponent from "./TileComponent";
import GameStatsComponent from "./GameStatsComponent";
import { useMemoryGame } from "../hooks/useMemoryGame";
import { useGameTimer } from "../hooks/useGameTimer";
import { demoConfig } from "../constants/demoConfig";

const MainGame = () => {
  const {
    tiles,
    gameStats,
    setGameStats,
    handleTileClick,
    startPlayPhase,
    endGame,
    resetGame,
    initializeTiles,
  } = useMemoryGame(demoConfig);

  // Timer management
  const currentPhaseTime =
    gameStats.phase === "study"
      ? demoConfig.studyTimeSeconds
      : demoConfig.playTimeSeconds;
  const isTimerActive =
    gameStats.phase === "study" || gameStats.phase === "play";

  const handleTimeUp = useCallback(() => {
    setGameStats((prev) => {
      if (prev.phase === "study") {
        startPlayPhase();
      } else if (prev.phase === "play") {
        endGame();
      }
      return prev;
    });
  }, [setGameStats, startPlayPhase, endGame]);

  const { timeRemaining, resetTimer } = useGameTimer(
    currentPhaseTime,
    isTimerActive,
    handleTimeUp
  );

  const handleReset = () => {
    resetGame();
    resetTimer(demoConfig.studyTimeSeconds);
  };

  const isGameDisabled =
    gameStats.phase === "study" || gameStats.phase === "results";

  // Initialize game on mount
  useEffect(() => {
    initializeTiles();
  }, [initializeTiles]);

  // Reset Timer when phase changes
  useEffect(() => {
    if (gameStats.phase === "study") {
      resetTimer(demoConfig.studyTimeSeconds);
    } else if (gameStats.phase === "play") {
      resetTimer(demoConfig.playTimeSeconds);
    }
  }, [gameStats.phase, resetTimer]);

  useEffect(() => {
    if (
      gameStats.phase === "play" &&
      gameStats.matches === demoConfig.gridSize / 2
    ) {
      endGame();
      resetTimer(0);
    }
  }, [gameStats.matches, gameStats.phase, endGame, resetTimer]);

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Memory Tile Game</h1>
        <p className="game-subtitle">
          Click tiles to reveal them. Match pairs to score points!
        </p>
      </header>

      <GameStatsComponent
        stats={gameStats}
        config={demoConfig}
        timeRemaining={timeRemaining}
      />

      <div className="tile-grid">
        {tiles.map((tile) => (
          <TileComponent
            key={tile.id}
            tile={tile}
            onTileClick={handleTileClick}
            disabled={isGameDisabled}
          />
        ))}
      </div>

      <div className="controls">
        <button onClick={handleReset} className="reset-button">
          Reset Game
        </button>
        {gameStats.phase === "study" && (
          <button onClick={startPlayPhase} className="skip-button">
            Skip to Play Phase
          </button>
        )}
      </div>
    </div>
  );
};

export default MainGame;

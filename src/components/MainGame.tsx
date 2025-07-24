import { useCallback, useEffect, useMemo } from "react";
import "../MemoryGame.css";
import TileComponent from "./TileComponent";
import GameStatsComponent from "./GameStatsComponent";
import { useMemoryGame } from "../hooks/useMemoryGame";
import { useGameTimer } from "../hooks/useGameTimer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { GameConfig, HighScore } from "../types/types";
import HighScoresComponent from "./HighScoresComponent";
import GameConfigComponent from "./GameConfigComponent";

const MainGame = () => {
  // Configuration state with localStorage persistence
  const [config, setConfig] = useLocalStorage<GameConfig>(
    "memory-game-config",
    {
      studyTimeSeconds: 15,
      playTimeSeconds: 60,
      gridSize: 12,
      difficulty: "medium",
    }
  );

  // High scores persistence
  const [highScores, setHighScores] = useLocalStorage<HighScore[]>(
    "memory-game-config",
    []
  );

  // Game logic
  const gameHook = useMemoryGame(config);
  const {
    tiles,
    gameStats,
    handleTileClick,
    startStudyPhase,
    startPlayPhase,
    endGame,
    resetGame,
  } = gameHook;

  // Timer management
  const currentPhaseTime = useMemo(() => {
    return gameStats.phase === "study"
      ? config.studyTimeSeconds
      : config.playTimeSeconds;
  }, [gameStats.phase, config.studyTimeSeconds, config.playTimeSeconds]);

  const isTimerActive =
    gameStats.phase === "study" || gameStats.phase === "play";

  const handleTimeUp = useCallback(() => {
    if (gameStats.phase === "study") {
      startPlayPhase();
    } else if (gameStats.phase === "play") {
      const newHighScore = endGame();

      setHighScores((prev) =>
        [...prev, newHighScore].sort((a, b) => b.score - a.score)
      );
    }
  }, [gameStats.phase, startPlayPhase, endGame, setHighScores]);

  const { timeRemaining, resetTimer } = useGameTimer(
    currentPhaseTime,
    isTimerActive,
    handleTimeUp
  );

  // Reset timer when phase changes
  useEffect(() => {
    resetTimer(currentPhaseTime);
  }, [gameStats.phase, resetTimer, currentPhaseTime]);

  // Check for game completion
  useEffect(() => {
    if (
      gameStats.phase === "play" &&
      gameStats.matches === config.gridSize / 2
    ) {
      const newHighScore = endGame();

      setHighScores((prev) =>
        [...prev, newHighScore].sort((a, b) => b.score - a.score)
      );
    }
  }, [
    gameStats.matches,
    gameStats.phase,
    config.gridSize,
    endGame,
    setHighScores,
  ]);

  const handleConfigChange = (newConfig: GameConfig) => {
    setConfig(newConfig);
  };

  const handleStartGame = () => {
    startStudyPhase();
  };

  const handleReset = () => {
    resetGame();
    resetTimer(config.studyTimeSeconds);
  };

  const isGameDisabled =
    gameStats.phase === "study" || gameStats.phase === "results";
  const gridColumns = 4;
  const gridRows = config.gridSize === 16 ? 4 : config.gridSize === 12 ? 3 : 2;

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Memory Game Tutorial</h1>
        <p className="game-subtitle">
          Enhanced game with localStorage persistence and better organization
        </p>
      </header>

      {gameStats.phase === "setup" ? (
        <div className="setup-layout">
          <GameConfigComponent
            config={config}
            onConfigChange={handleConfigChange}
            onStartGame={handleStartGame}
          />
          <HighScoresComponent
            highScores={highScores}
            currentScore={undefined}
          />
        </div>
      ) : (
        <>
          <GameStatsComponent
            stats={gameStats}
            config={config}
            timeRemaining={timeRemaining}
          />

          <div
            className="tile-grid"
            style={{
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gridTemplateRows: `repeat(${gridRows}, 1fr)`,
            }}
          >
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
              New Game
            </button>
            {gameStats.phase === "study" && (
              <button onClick={startPlayPhase} className="skip-button">
                Skip to Play
              </button>
            )}
          </div>

          {gameStats.phase === "results" && (
            <HighScoresComponent
              highScores={highScores}
              currentScore={gameStats.score}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MainGame;

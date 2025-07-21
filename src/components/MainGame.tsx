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
      endGame();
    }
  }, [gameStats.phase, startPlayPhase, endGame]);

  const { timeRemaining, resetTimer } = useGameTimer(
    currentPhaseTime,
    isTimerActive,
    handleTimeUp
  );

  // Save high score when game ends
  useEffect(() => {
    if (gameStats.phase === "results" && gameStats.score > 0) {
      const newScore: HighScore = {
        score: gameStats.score,
        matches: gameStats.matches,
        timeElapsed: gameStats.tilesClicked, // Using clicks as time proxy
        difficulty: config.difficulty,
        date: new Date().toLocaleDateString(),
      };

      setHighScores(
        (prev) =>
          [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10) // Keep top 10
      );
    }
  }, [
    config.difficulty,
    gameStats.phase,
    gameStats.score,
    gameStats.matches,
    gameStats.tilesClicked,
    setHighScores,
  ]);

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
      endGame();
    }
  }, [gameStats.matches, gameStats.phase, config.gridSize, endGame]);

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
  const gridColumns = Math.sqrt(config.gridSize);

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
            style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
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

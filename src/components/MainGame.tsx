import { useCallback, useEffect, useMemo } from "react";
import "../MemoryGame.css";
import TileComponent from "./TileComponent";
import GameStatsComponent from "./GameStatsComponent";
import { useMemoryGame } from "../hooks/useMemoryGame";
import { useGameTimer } from "../hooks/useGameTimer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { GameConfig, GameTheme, HighScore } from "../types/types";
import HighScoresComponent from "./HighScoresComponent";
import GameConfigComponent from "./GameConfigComponent";
import themes from "../themes";
import ThemeSwitcher from "./ThemeSwitcher";
import GameControlsComponent from "./GameControlsComponent";

const MainGame = () => {
  // Configuration state with localStorage persistence
  const [config, setConfig] = useLocalStorage<GameConfig>(
    "memory-game-config",
    {
      studyTimeSeconds: 15,
      playTimeSeconds: 60,
      gridSize: 12,
      difficulty: "medium",
      enableSound: true,
      enableAnimations: true,
      theme: "default",
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
    pauseGame,
    resumeGame,
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
        [...prev, newHighScore].sort((a, b) => b.score - a.score).slice(0, 10)
      );
    }
  }, [gameStats.phase, startPlayPhase, endGame, setHighScores]);

  const { timeRemaining, isPaused, resetTimer, pauseTimer, resumeTimer } =
    useGameTimer(currentPhaseTime, isTimerActive, handleTimeUp);

  // Reset timer when phase changes
  useEffect(() => {
    resetTimer(currentPhaseTime);
  }, [gameStats.phase, resetTimer, currentPhaseTime]);

  // Handle pause/resume
  useEffect(() => {
    if (gameStats.phase === "paused") {
      pauseTimer();
    } else if (gameStats.phase === "play") {
      resumeTimer();
    }
  }, [gameStats.phase, pauseTimer, resumeTimer]);

  // Check for game completion
  useEffect(() => {
    if (
      gameStats.phase === "play" &&
      gameStats.matches === config.gridSize / 2
    ) {
      const newHighScore = endGame();

      setHighScores((prev) =>
        [...prev, newHighScore].sort((a, b) => b.score - a.score).slice(0, 10)
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

  const handlePause = () => {
    pauseGame();
  };

  const handleResume = () => {
    resumeGame();
  };

  const handleThemeSwitch = (newTheme: GameTheme) => {
    setConfig((prev) => ({ ...prev, theme: newTheme }));
  };

  const isGameDisabled =
    gameStats.phase === "study" || gameStats.phase === "results";
  const gridColumns = 4;
  const gridRows = config.gridSize === 16 ? 4 : config.gridSize === 12 ? 3 : 2;
  const currentTheme = themes[config.theme];

  return (
    <div
      className="game-container"
      style={{ background: currentTheme.background }}
    >
      <ThemeSwitcher
        currentTheme={config.theme}
        onThemeChange={handleThemeSwitch}
        theme={currentTheme}
      />

      <header className="game-header">
        <h1 className="game-title">Memory Game Tutorial</h1>
        <p className="game-subtitle">
          Enhanced with pause/resume, sound effects, theming, and better
          animations
        </p>
      </header>

      {gameStats.phase === "setup" ? (
        <div className="setup-layout">
          <GameConfigComponent
            config={config}
            onConfigChange={handleConfigChange}
            onStartGame={handleStartGame}
            theme={currentTheme}
          />
          <HighScoresComponent
            highScores={highScores}
            currentScore={undefined}
            theme={currentTheme}
          />
        </div>
      ) : (
        <>
          <GameStatsComponent
            stats={gameStats}
            config={config}
            timeRemaining={timeRemaining}
            isPaused={isPaused}
            theme={currentTheme}
          />

          <div
            className="tile-grid"
            style={{
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gridTemplateRows: `repeat(${gridRows}, 1fr)`,
              background: currentTheme.cardBackground,
            }}
          >
            {tiles.map((tile) => (
              <TileComponent
                key={tile.id}
                tile={tile}
                onTileClick={handleTileClick}
                disabled={isGameDisabled}
                theme={currentTheme}
                enableAnimations={config.enableAnimations}
              />
            ))}
          </div>

          <GameControlsComponent
            phase={gameStats.phase}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
            onSkip={gameStats.phase === "study" ? startPlayPhase : undefined}
            theme={currentTheme}
          />

          {gameStats.phase === "results" && (
            <HighScoresComponent
              highScores={highScores}
              currentScore={gameStats.score}
              theme={currentTheme}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MainGame;

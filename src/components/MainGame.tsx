import { useCallback, useEffect, useMemo, useRef } from "react";
import "../MemoryGame.css";
import TileComponent from "./TileComponent";
import GameStatsComponent from "./GameStatsComponent";
import { useMemoryGame } from "../hooks/useMemoryGame";
import { useGameTimer } from "../hooks/useGameTimer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  GameConfig,
  GameTheme,
  HighScore,
  PlayerProfile,
} from "../types/types";
import HighScoresComponent from "./HighScoresComponent";
import GameConfigComponent from "./GameConfigComponent";
import themes from "../themes";
import ThemeSwitcher from "./ThemeSwitcher";
import GameControlsComponent from "./GameControlsComponent";
import { updatedPlayerProfile } from "../utils/helpers";
import PlayerStatsComponent from "./PlayerStatsComponent";
import PlayerProfileComponent from "./PlayerProfileComponent";

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
    "memory-game-scores",
    []
  );

  const [playerProfile, setPlayerProfile] = useLocalStorage<PlayerProfile>(
    "memory-game-profile",
    {
      name: "Player 1",
      avatar: "👤",
      totalGamesPlayed: 0,
      totalWins: 0,
      highestScore: 0,
      highestStreak: 0,
      perfectGames: 0,
      stats: {
        totalMatches: 0,
        totalMismatches: 0,
        averageAccuracy: 0,
        averageScore: 0,
        fastestWin: 0,
        gamesPerDifficulty: { easy: 0, medium: 0, hard: 0 },
        winStreak: 0,
        currentWinStreak: 0,
      },
      createdDate: new Date().toLocaleDateString(),
    }
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

  // Store the current time in a ref to avoid circular dependency
  const currentTimeRef = useRef(currentPhaseTime);

  const handleTimeUp = useCallback(() => {
    if (gameStats.phase === "study") {
      startPlayPhase();
    } else if (gameStats.phase === "play") {
      const result = endGame(currentTimeRef.current);

      // Update player profile
      const isWin = gameStats.matches === config.gridSize / 2;
      const newWinStreak = isWin ? playerProfile.stats.winStreak + 1 : 0;

      const newProfile = updatedPlayerProfile(
        playerProfile,
        gameStats,
        result,
        isWin,
        newWinStreak
      );

      setPlayerProfile(newProfile);

      const newHighScore = {
        ...result,
        playerName: playerProfile.name,
      };

      setHighScores((prev) =>
        [...prev, newHighScore].sort((a, b) => b.score - a.score).slice(0, 10)
      );
    }
  }, [
    gameStats,
    config.gridSize,
    playerProfile,
    startPlayPhase,
    endGame,
    setHighScores,
    setPlayerProfile,
  ]);

  const { timeRemaining, isPaused, resetTimer, pauseTimer, resumeTimer } =
    useGameTimer(currentPhaseTime, isTimerActive, handleTimeUp);

  // Update ref when timeRemaining changes
  useEffect(() => {
    currentTimeRef.current = timeRemaining;
  }, [timeRemaining]);

  const prevPhase = useRef(gameStats.phase);

  useEffect(() => {
    if (gameStats.phase === "paused") {
      pauseTimer();
    } else if (gameStats.phase === "play" && prevPhase.current === "paused") {
      resumeTimer(); // Only resume from pause, don't reset
    } else if (gameStats.phase !== prevPhase.current) {
      resetTimer(currentPhaseTime); // Reset on any other phase change
    }

    prevPhase.current = gameStats.phase;
  }, [gameStats.phase, currentPhaseTime, resetTimer, pauseTimer, resumeTimer]);

  // Check for game completion
  useEffect(() => {
    if (
      gameStats.phase === "play" &&
      gameStats.matches === config.gridSize / 2
    ) {
      handleTimeUp();
    }
  }, [gameStats.matches, gameStats.phase, config.gridSize, handleTimeUp]);

  const handleThemeSwitch = (newTheme: GameTheme) => {
    setConfig((prev) => ({ ...prev, theme: newTheme }));
  };

  const handleUpdateProfile = (updates: Partial<PlayerProfile>) => {
    setPlayerProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleStartGame = () => {
    startStudyPhase();
  };

  const handleReset = () => {
    resetGame();
    resetTimer(config.studyTimeSeconds);
  };

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
        <h1 className="game-title">Memory Game - Day 6a</h1>
        <p className="game-subtitle">Player Profiles & Statistics Tracking</p>
      </header>

      {gameStats.phase === "setup" && (
        <div className="setup-layout">
          <PlayerProfileComponent
            profile={playerProfile}
            theme={currentTheme}
            onUpdateProfile={handleUpdateProfile}
          />
          <PlayerStatsComponent
            stats={playerProfile.stats}
            totalGames={playerProfile.totalGamesPlayed}
            theme={currentTheme}
          />
        </div>
      )}

      <div className="game-actions">
        {gameStats.phase === "setup" && (
          <button
            onClick={handleStartGame}
            className="action-btn"
            style={{ background: currentTheme.primaryColor }}
          >
            Start Game
          </button>
        )}
        {gameStats.phase !== "setup" && (
          <button
            onClick={handleReset}
            className="action-btn"
            style={{ background: currentTheme.errorColor }}
          >
            New Game
          </button>
        )}
      </div>
    </div>
  );
};

export default MainGame;

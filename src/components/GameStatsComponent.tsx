import type { GameConfig, GameStats, ThemeConfig } from "../types/types";

type GameStatsProps = {
  stats: GameStats;
  config: GameConfig;
  timeRemaining: number;
  isPaused: boolean;
  theme: ThemeConfig;
};

const GameStatsComponent = ({
  stats,
  config,
  timeRemaining,
  isPaused,
  theme,
}: GameStatsProps) => {
  const getPhaseDisplay = (): string => {
    switch (stats.phase) {
      case "setup":
        return "Ready to Play";
      case "study":
        return "Study Phase - Memorize the tiles!";
      case "play":
        return "Play Phase - Find the matches!";
      case "results":
        return "Game Complete!";
      default:
        return "Ready to play";
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (): number => {
    const totalPairs = config.gridSize / 2;
    return totalPairs > 0 ? (stats.matches / totalPairs) * 100 : 0;
  };

  return (
    <div
      className="stats-container"
      style={{ background: theme.cardBackground, color: theme.textColor }}
    >
      <div className="phase-indicator">
        <h2 className="phase-title">{getPhaseDisplay()}</h2>
        {(stats.phase === "study" ||
          stats.phase === "play" ||
          stats.phase === "paused") && (
          <div
            className={`timer ${isPaused ? "timer--paused" : ""}`}
            style={{
              color: isPaused ? "#fbbf24" : theme.primaryColor,
              background: isPaused
                ? "rgba(251, 191, 36, 0.1)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            {isPaused ? "⏸️" : "⏰"} {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div
            className="stat-number stat-number--primary"
            style={{ color: theme.primaryColor }}
          >
            {stats.score}
          </div>
          <div className="stat-label">Score</div>
        </div>
        <div className="stat-item">
          <div
            className="stat-number stat-number--success"
            style={{ color: theme.successColor }}
          >
            {stats.matches}
          </div>
          <div className="stat-label">Matches</div>
        </div>
        <div className="stat-item">
          <div
            className="stat-number stat-number--info"
            style={{ color: "#6b7280" }}
          >
            {stats.accuracy}%
          </div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-item">
          <div
            className="stat-number stat-number--warning"
            style={{ color: theme.errorColor }}
          >
            {stats.mismatches}
          </div>
          <div className="stat-label">Mismatches</div>
        </div>
      </div>

      {stats.phase === "play" && (
        <div className="progress-container">
          <div className="progress-label">
            Progress: {Math.round(getProgressPercentage())}%
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${getProgressPercentage()}%`,
                background: theme.successColor,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatsComponent;

import type { GameConfig, GameStats } from "../types/types";

type GameStatsProps = {
  stats: GameStats;
  config: GameConfig;
  timeRemaining: number;
};

const GameStatsComponent = ({
  stats,
  config,
  timeRemaining,
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
    <div className="stats-container">
      <div className="phase-indicator">
        <h2 className="phase-title">{getPhaseDisplay()}</h2>
        {(stats.phase === "study" || stats.phase === "play") && (
          <div className="timer">Time: {formatTime(timeRemaining)}</div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number stat-number--primary">{stats.score}</div>
          <div className="stat-label">Score</div>
        </div>
        <div className="stat-item">
          <div className="stat-number stat-number--success">
            {stats.matches}
          </div>
          <div className="stat-label">Matches Found</div>
        </div>
        <div className="stat-item">
          <div className="stat-number stat-number--info">
            {stats.tilesClicked}
          </div>
          <div className="stat-label">Tiles Clicked</div>
        </div>
        <div className="stat-item">
          <div className="stat-number stat-number--warning">
            {config.gridSize / 2}
          </div>
          <div className="stat-label">Total Pairs</div>
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
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatsComponent;

import type { GameConfig, GameStats } from "../types/game";

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
      case "study":
        return "Study Phase - Memorize the tiles!";
      case "play":
        return "Play Phase - Find the matches!";
      case "results":
        return "Game Complete!";
      default:
        return "";
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="stats-container">
      <div className="phase-indicator">
        <h2 className="phase-title">{getPhaseDisplay()}</h2>
        <div>Time: {formatTime(timeRemaining)}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number stat-number--primary">
            {stats.tilesClicked}
          </div>
          <div className="stat-label">Tiles Clicked</div>
        </div>
        <div className="stat-item">
          <div className="stat-number stat-number--success">
            {stats.matches}
          </div>
          <div className="stat-label">Matches Found</div>
        </div>
        <div className="stat-item">
          <div className="stat-number stat-number--info">
            {config.gridSize / 2}
          </div>
          <div className="stat-label">Total Pairs</div>
        </div>
      </div>
    </div>
  );
};

export default GameStatsComponent;

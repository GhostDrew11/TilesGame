import { TrendingUp } from "lucide-react";
import type { GameDifficulty, PlayerStats, ThemeConfig } from "../types/types";

type PlayerStatsProps = {
  stats: PlayerStats;
  totalGames: number;
  theme: ThemeConfig;
};

const PlayerStatsComponent = ({
  stats,
  totalGames,
  theme,
}: PlayerStatsProps) => {
  const getStatColor = (value: number, max: number = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return theme.successColor;
    if (percentage >= 50) return theme.warningColor;
    return theme.errorColor;
  };

  return (
    <div
      className="player-stats-panel"
      style={{ background: theme.cardBackground, color: theme.textColor }}
    >
      <div className="stats-header">
        <h3 className="stats-title">
          <TrendingUp style={{ width: 24, height: 24 }} /> Detailed Statistics
        </h3>
      </div>

      <div className="stats-grid-detailed">
        <div className="stat-card">
          <div
            className="stat-card-value"
            style={{ color: theme.successColor }}
          >
            {stats.totalMatches}
          </div>
          <div className="stat-card-label">Total Matches</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-value" style={{ color: theme.errorColor }}>
            {stats.totalMismatches}
          </div>
          <div className="stat-card-label">Total Mismatches</div>
        </div>

        <div className="stat-card">
          <div
            className="stat-card-value"
            style={{ color: getStatColor(stats.averageAccuracy) }}
          >
            {stats.averageAccuracy}%
          </div>
          <div className="stat-card-label">Avg Accuracy</div>
        </div>

        <div className="stat-card">
          <div
            className="stat-card-value"
            style={{ color: theme.primaryColor }}
          >
            {stats.averageScore}
          </div>
          <div className="stat-card-label">Avg Score</div>
        </div>

        <div className="stat-card">
          <div
            className="stat-card-value"
            style={{ color: theme.warningColor }}
          >
            {stats.winStreak}
          </div>
          <div className="stat-card-label">Best Win Streak</div>
        </div>

        <div className="stat-card">
          <div
            className="stat-card-value"
            style={{ color: theme.successColor }}
          >
            {stats.fastestWin > 0 ? `${stats.fastestWin}s` : "N/A"}
          </div>
          <div className="stat-card-label">Fastest Win</div>
        </div>
      </div>

      <div className="difficulty-breakdown">
        <h4 className="breakdown-title">Games by Difficulty</h4>
        <div className="difficulty-bars">
          {(["easy", "medium", "hard"] as GameDifficulty[]).map((diff) => {
            const count = stats.gamesPerDifficulty[diff];
            const percentage = totalGames > 0 ? (count / totalGames) * 100 : 0;

            return (
              <div key={diff} className="difficulty-bar-item">
                <div className="difficulty-bar-label">
                  <span>{diff.charAt(0).toUpperCase() + diff.slice(1)}</span>
                  <span>{count} games</span>
                </div>
                <div className="difficulty-bar-track">
                  <div
                    className="difficulty-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      background: theme.primaryColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsComponent;

import { useState } from "react";
import type { PlayerProfile, ThemeConfig } from "../types/types";
import { Star, Trophy } from "lucide-react";

type PlayerProfileProps = {
  profile: PlayerProfile;
  theme: ThemeConfig;
  onUpdateProfile: (profile: Partial<PlayerProfile>) => void;
};

const PlayerProfileComponent = ({
  profile,
  theme,
  onUpdateProfile,
}: PlayerProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);

  const handleSaveName = () => {
    onUpdateProfile({ name: editName });
    setIsEditing(false);
  };

  const winRate =
    profile.totalGamesPlayed > 0
      ? Math.round((profile.totalWins / profile.totalGamesPlayed) * 100)
      : 0;

  return (
    <div
      className="player-profile"
      style={{ background: theme.cardBackground, color: theme.textColor }}
    >
      <div className="profile-header">
        <div
          className="profile-avatar"
          style={{ background: theme.primaryColor }}
        >
          {profile.avatar}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <div className="profile-edit">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="profile-input"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.textColor,
                }}
                maxLength={20}
              />
              <button
                onClick={handleSaveName}
                className="save-btn"
                style={{ background: theme.successColor }}
              >
                Save
              </button>
            </div>
          ) : (
            <div className="profile-name-display">
              <h3 className="profile-name">{profile.name}</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-btn"
                style={{ color: theme.primaryColor }}
              >
                ✏️ Edit
              </button>
            </div>
          )}
          <div className="profile-stats-grid">
            <div className="profile-stat">
              <span
                className="stat-value"
                style={{ color: theme.primaryColor }}
              >
                {profile.totalGamesPlayed}
              </span>
              <span className="stat-label">Games</span>
            </div>
            <div className="profile-stat">
              <span
                className="stat-value"
                style={{ color: theme.successColor }}
              >
                {winRate}%
              </span>
              <span className="stat-label">Win Rate</span>
            </div>
            <div className="profile-stat">
              <span
                className="stat-value"
                style={{ color: theme.warningColor }}
              >
                {profile.stats.currentWinStreak}
              </span>
              <span className="stat-label">Winning Streak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-records">
        <div className="record-item">
          <Trophy
            style={{ color: theme.warningColor, width: 32, height: 32 }}
          />
          <div>
            <div className="record-value">{profile.highestScore}</div>
            <div className="record-label">Highest Score</div>
          </div>
        </div>
        <div className="record-item">
          <Star style={{ color: theme.primaryColor, width: 32, height: 32 }} />
          <div>
            <div className="record-value">{profile.stats.averageAccuracy}%</div>
            <div className="record-label">Avg Accuracy</div>
          </div>
        </div>
      </div>

      <div className="profile-footer">
        <span className="profile-date">Member since {profile.createdDate}</span>
      </div>
    </div>
  );
};

export default PlayerProfileComponent;

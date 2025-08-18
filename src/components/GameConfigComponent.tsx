import {
  type GameConfig,
  type GameDifficulty,
  type ThemeConfig,
} from "../types/types";

type GameConfigProps = {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  onStartGame: () => void;
  theme: ThemeConfig;
};

const GameConfigComponent = ({
  config,
  onConfigChange,
  onStartGame,
  theme,
}: GameConfigProps) => {
  const handleDifficultyChange = (difficulty: GameDifficulty) => {
    const configs = {
      easy: { gridSize: 8, studyTime: 20, playTime: 90 },
      medium: { gridSize: 12, studyTime: 15, playTime: 60 },
      hard: { gridSize: 16, studyTime: 10, playTime: 45 },
    };

    const newConfig = configs[difficulty];
    onConfigChange({
      ...config,
      difficulty,
      gridSize: newConfig.gridSize,
      studyTimeSeconds: newConfig.studyTime,
      playTimeSeconds: newConfig.playTime,
    });
  };

  const updateConfig = <K extends keyof GameConfig>(
    key: K,
    value: GameConfig[K]
  ) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div
      className="config-container"
      style={{ background: theme.cardBackground, color: theme.textColor }}
    >
      <h2 className="config-title">Game Configuration</h2>

      <div className="config-section">
        <label className="config-label">Difficulty:</label>
        <div className="difficulty-buttons">
          {(["easy", "medium", "hard"] as GameDifficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={"difficulty-btn"}
              style={{
                borderColor:
                  config.difficulty === diff ? theme.primaryColor : "#e5e7eb",
                background:
                  config.difficulty === diff
                    ? theme.primaryColor
                    : "transparent",
                color: config.difficulty === diff ? "white" : theme.textColor,
              }}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="config-section">
        <div className="config-toggles">
          <label className="config-toggle">
            <input
              type="checkbox"
              checked={config.enableSound}
              onChange={(e) => updateConfig("enableSound", e.target.checked)}
              style={{ accentColor: theme.primaryColor }}
            />
            <span>🔊 Sound Effects</span>
          </label>
          <label className="config-toggle">
            <input
              type="checkbox"
              checked={config.enableAnimations}
              onChange={(e) =>
                updateConfig("enableAnimations", e.target.checked)
              }
              style={{ accentColor: theme.primaryColor }}
            />
            <span>✨ Animations</span>
          </label>
        </div>
      </div>

      <div className="config-info">
        <div className="config-detail">
          <span>Grid Size:</span> {config.gridSize} tiles ({config.gridSize / 2}{" "}
          pairs)
        </div>
        <div className="config-detail">
          <span>Study Time:</span> {config.studyTimeSeconds} seconds
        </div>
        <div className="config-detail">
          <span>Play Time:</span> {config.playTimeSeconds} seconds
        </div>
      </div>

      <button
        onClick={onStartGame}
        className="start-game-btn"
        style={{ background: theme.primaryColor }}
      >
        🎮 Start Game
      </button>
    </div>
  );
};

export default GameConfigComponent;

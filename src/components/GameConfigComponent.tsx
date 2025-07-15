import { type GameConfig, type GameDifficulty } from "../types/types";

type GameConfigProps = {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  onStartGame: () => void;
};

const GameConfigComponent = ({
  config,
  onConfigChange,
  onStartGame,
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

  return (
    <div className="config-container">
      <h2 className="config-title">Game Configuration</h2>

      <div className="config-section">
        <label className="config-label">Difficulty:</label>
        <div className="difficulty-buttons">
          {(["easy", "medium", "hard"] as GameDifficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`difficulty-btn ${
                config.difficulty === diff ? "difficulty-btn--active" : ""
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
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

      <button onClick={onStartGame} className="start-game-btn">
        Start Game
      </button>
    </div>
  );
};

export default GameConfigComponent;

import { Difficulty, type GameConfig } from "../types/types";
import { saveToStorage } from "../utils/localStorage";
import { STORAGE_KEY } from "../constants/storageKeys";
import type { ThemeKey } from "../themes";
import themes from "../themes";
import { difficultySettings } from "../constants/difficultySettings";

type ConfigurationPanelProps = {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  onStartGame: () => void;
};

const ConfigurationPanel = ({
  config,
  onConfigChange,
  onStartGame,
}: ConfigurationPanelProps) => {
  const updateConfig = <K extends keyof GameConfig>(
    key: K,
    value: GameConfig[K]
  ) => {
    const newConfig = { ...config, [key]: value };
    onConfigChange(newConfig);
    saveToStorage(STORAGE_KEY, newConfig);
  };

  return (
    <div className="config-panel">
      <h2 className="config-title">Game Configuration</h2>

      <div className="config-section">
        <label className="config-label">
          <span>Difficulty:</span>
          <select
            value={config.difficulty}
            onChange={(e) =>
              updateConfig("difficulty", e.target.value as Difficulty)
            }
            className="config-select"
          >
            {Object.values(Difficulty).map((diff) => (
              <option key={diff} value={diff}>
                {diff.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="config-section">
        <label className="config-label">
          <span>Theme:</span>
          <select
            className="config-select"
            value={config.theme}
            onChange={(e) => updateConfig("theme", e.target.value as ThemeKey)}
          >
            {Object.keys(themes).map((themeKey) => (
              <option key={themeKey} value={themeKey}>
                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="config-section">
        <label className="config-label">
          <span>Study Time (seconds):</span>
          <input
            type="range"
            min="5"
            max="30"
            value={config.studyTimeSeconds}
            onChange={(e) =>
              updateConfig("studyTimeSeconds", parseInt(e.target.value))
            }
          />
          <span className="config-value">{config.studyTimeSeconds}</span>
        </label>
      </div>

      <div className="config-section">
        <label className="config-label">
          <span>Play Time (seconds):</span>
          <input
            type="range"
            min="30"
            max="300"
            value={config.playTimeSeconds}
            onChange={(e) =>
              updateConfig("playTimeSeconds", parseInt(e.target.value))
            }
            className="config-slider"
          />
          <span className="config-value">{config.playTimeSeconds}s</span>
        </label>
      </div>

      <div className="config-section">
        <div className="config-toggles">
          <label className="config-toggle">
            <input
              type="checkbox"
              checked={config.enableSound}
              onChange={(e) => updateConfig("enableSound", e.target.checked)}
            />
            <span>Sound Effects</span>
          </label>
          <label className="config-toggle">
            <input
              type="checkbox"
              checked={config.enableAnimations}
              onChange={(e) =>
                updateConfig("enableAnimations", e.target.checked)
              }
            />
            <span>Animations</span>
          </label>
        </div>

        <div className="difficulty-info">
          <h3>Difficulty Settings:</h3>
          <p>
            <strong>{config.difficulty.toUpperCase()}: </strong>
            {difficultySettings[config.difficulty].pairs} pairs,
            {difficultySettings[config.difficulty].gridSize} tiles total
          </p>
        </div>

        <button onClick={onStartGame} className="start-button">
          Start Game
        </button>
      </div>
    </div>
  );
};

export default ConfigurationPanel;

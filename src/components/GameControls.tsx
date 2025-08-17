import type { GamePhase } from "../types/types";
import type { Theme } from "../themes";

type GameControlsProps = {
  phase: GamePhase;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip?: () => void;
  theme: Theme;
};

const GameControls = ({
  phase,
  onPause,
  onResume,
  onReset,
  onSkip,
  theme,
}: GameControlsProps) => {
  return (
    <div className="game-controls">
      {phase === "play" && (
        <button
          onClick={onPause}
          className="control-button pause-button"
          style={{ background: theme.primaryColor }}
        >
          ⏸️ Pause
        </button>
      )}
      {phase === "paused" && (
        <button
          onClick={onResume}
          className="control-button resume-button"
          style={{ background: theme.successColor }}
        >
          ▶️ Resume
        </button>
      )}
      {phase === "study" && onSkip && (
        <button
          onClick={onSkip}
          className="control-button skip-button"
          style={{ background: "#fbbf24" }}
        >
          ⏭️ Skip to Play
        </button>
      )}
      <button
        onClick={onReset}
        className="control-button reset-button"
        style={{ background: theme.errorColor }}
      >
        🔄 Reset
      </button>
    </div>
  );
};

export default GameControls;

import { Pause, Play, RotateCcw } from "lucide-react";
import type { GamePhase } from "../types/types";

type GameControlsProps = {
  phase: GamePhase;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip?: () => void;
};

const GameControls = ({
  phase,
  onPause,
  onResume,
  onReset,
  onSkip,
}: GameControlsProps) => {
  return (
    <div className="game-controls">
      {phase === "play" && (
        <button onClick={onPause} className="control-button pause-button">
          <Pause className="icon" /> Pause
        </button>
      )}
      {phase === "paused" && (
        <button onClick={onResume} className="control-button resume-button">
          <Play className="icon" /> Resume
        </button>
      )}
      {phase === "study" && onSkip && (
        <button onClick={onSkip} className="control-button skip-button">
          Skip to Play
        </button>
      )}
      <button onClick={onReset} className="control-button reset-button">
        <RotateCcw className="icon" /> Reset
      </button>
    </div>
  );
};

export default GameControls;

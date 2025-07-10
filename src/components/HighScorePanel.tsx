import { useEffect, useState } from "react";
import type { Difficulty, HighScore } from "../types/types";
import { loadFromStorage } from "../utils/localStorage";
import { HIGHSCORES_KEY } from "../constants/storageKeys";
import { Trophy } from "lucide-react";

type HighScorePanelProps = {
  difficulty: Difficulty;
};

const HighScorePanel = ({ difficulty }: HighScorePanelProps) => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  useEffect(() => {
    const scores = loadFromStorage(HIGHSCORES_KEY, []);
    const filteredScores = scores.filter(
      (score: HighScore) => score.difficulty === difficulty
    );
    setHighScores(filteredScores.slice(0, 5));
  }, [difficulty]);

  if (highScores.length === 0) {
    return (
      <div className="high-score-panel">
        <h3>
          <Trophy className="icon" /> High Scores ({difficulty.toUpperCase()})
        </h3>
        <p>No scores yet for this difficulty!</p>
      </div>
    );
  }

  return (
    <div className="high-score-panel">
      <h3>
        <Trophy className="icon" /> High Scores ({difficulty.toUpperCase()})
      </h3>
      <div className="score-list">
        {highScores.map((score, index) => (
          <div key={score.id} className="score-item">
            <div className="score-rank">#{index + 1}</div>
            <div className="score-details">
              <div className="score-value">{score.score} pts</div>
              <div className="score-meta">
                {score.accuracy}% accuracy • {score.timeElapsed}s
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighScorePanel;

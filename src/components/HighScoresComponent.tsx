import type { HighScore, ThemeConfig } from "../types/types";

type HighScoresProps = {
  highScores: HighScore[];
  currentScore?: number;
  theme: ThemeConfig;
};

const HighScoresComponent = ({
  highScores,
  currentScore,
  theme,
}: HighScoresProps) => {
  return (
    <div
      className="highscores-container"
      style={{ background: theme.cardBackground, color: theme.textColor }}
    >
      <h3 className="highscores-title">🏆 High Scores</h3>
      {highScores.length === 0 ? (
        <p className="no-scores">No high scores yet!</p>
      ) : (
        <div className="scores-list">
          {highScores.slice(0, 5).map((score, index) => (
            <div
              key={index}
              className={`score-item ${
                currentScore === score.score ? "score-item--current" : ""
              }`}
              style={{
                background:
                  currentScore === score.score
                    ? theme.primaryColor
                    : "rgba(0,0,0,0.05)",
                color: currentScore === score.score ? "white" : theme.textColor,
              }}
            >
              <span className="score-rank">#{index + 1}</span>
              <span className="score-value">{score.score} pts</span>
              <span className="score-difficulty">{score.difficulty}</span>
              <span className="score-accuracy">{score.accuracy}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HighScoresComponent;

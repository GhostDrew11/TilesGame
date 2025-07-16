import type { HighScore } from "../types/types";

type HighScoresProps = {
  highScores: HighScore[];
  currentScore?: number;
};

const HighScoresComponent = ({ highScores, currentScore }: HighScoresProps) => {
  return (
    <div className="highscores-container">
      <h3 className="highscores-title">High Scores</h3>
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
            >
              <span className="score-rank">#{index + 1}</span>
              <span className="score-value">{score.score}</span>
              <span className="score-difficulty">{score.difficulty}</span>
              <span className="score-date">{score.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HighScoresComponent;

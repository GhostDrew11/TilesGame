import { useState } from "react";
import type { GameStats, Tile } from "../utils/constants/type";
import "../MemoryGame.css";
import Tile from "./TileComponent";
import TileComponent from "./TileComponent";

const MainGame = () => {
  const initialTiles: Tile[] = [
    { id: 1, value: "🎮", isRevealed: false, isMatched: false },
    { id: 2, value: "🎯", isRevealed: false, isMatched: false },
    { id: 3, value: "🎪", isRevealed: false, isMatched: false },
    { id: 4, value: "🎮", isRevealed: false, isMatched: false },
    { id: 5, value: "🎯", isRevealed: false, isMatched: false },
    { id: 6, value: "🎪", isRevealed: false, isMatched: false },
  ];

  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [gameStats, setGameStats] = useState<GameStats>({
    tilesClicked: 0,
    matches: 0,
  });
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);

  const handleTileClick = () => {};

  const resetGame = () => {
    setTiles(initialTiles);
    setGameStats({
      tilesClicked: 0,
      matches: 0,
    });
    setSelectedTiles([]);
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Memory Tile Game</h1>
        <p className="game-subtitle">
          Click tiles to reveal them. Match pairs to score points!
        </p>
      </header>

      <div className="stat-container">
        <div className="stat-item">
          <div className="stat-number stat-number--primary">
            {gameStats.tilesClicked}
          </div>
          <div className="stat-label">Tiles Clicked</div>
        </div>
        <div className="stat-item">
          <div className="stat-number stat-number--success">
            {gameStats.matches}
          </div>
          <div className="stat-label">Matches Found</div>
        </div>
      </div>

      <div className="tile-grid">
        {tiles.map((tile) => (
          <TileComponent
            key={tile.id}
            tile={tile}
            onTileClick={handleTileClick}
          ></TileComponent>
        ))}
      </div>

      <button onClick={resetGame} className="reset-button">
        Reset Game
      </button>
    </div>
  );
};

export default MainGame;

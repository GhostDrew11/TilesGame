import { useState } from "react";
import type { GameStats, Tile } from "../types/game";
import "../MemoryGame.css";
import TileComponent from "./TileComponent";
import GameStatsComponent from "./GameStatsComponent";

const MainGame = () => {
  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Memory Tile Game</h1>
        <p className="game-subtitle">
          Click tiles to reveal them. Match pairs to score points!
        </p>
      </header>

      <GameStatsComponent
        stats={gameStats}
        config={config}
        timeRemaining={timeRemaining}
      />

      <div className="tile-grid">
        {tiles.map((tile) => (
          <TileComponent
            key={tile.id}
            tile={tile}
            onTileClick={handleTileClick}
            disabled={isGameDisabled}
          />
        ))}
      </div>

      <div className="controls">
        <button onClick={handleReset} className="reset-button">
          Reset Game
        </button>
        {gameStats.phase === "study" && (
          <button onClick={startPlayPhase} className="skip-button">
            Skip to Play Phase
          </button>
        )}
      </div>
    </div>
  );
};

export default MainGame;

import type { Tile } from "../types/game";

type TileProps = {
  tile: Tile;
  onTileClick: (id: number) => void;
};

const TileComponent = ({ tile, onTileClick }: TileProps) => {
  const handleTileClicked = () => {
    if (!tile.isRevealed && !tile.isMatched) {
      onTileClick(tile.id);
    }
  };

  const getTileClass = (): string => {
    if (tile.isMatched) return "tile tile--matched";
    if (tile.isRevealed) return "tile tile--revealed";
    return "tile tile--hidden";
  };

  return (
    <button
      onClick={handleTileClicked}
      className={getTileClass()}
      disabled={tile.isRevealed || tile.isMatched}
    >
      {tile.isRevealed || tile.isMatched ? tile.value : "?"}
    </button>
  );
};

export default TileComponent;

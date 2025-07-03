import type { Tile } from "../utils/constants/type";

type TileProps = {
  tile: Tile;
  onTileClick: (id: number) => void;
};

const Tile = ({ tile, onTileClick }: TileProps) => {
  const handleTileClicked = () => {
    onTileClick(tile.id);
  };

  return (
    <button
      onClick={handleTileClicked}
      disabled={tile.isRevealed || tile.isMatched}
    >
      {tile.isRevealed || tile.isMatched ? tile.value : "?"}
    </button>
  );
};

export default Tile;

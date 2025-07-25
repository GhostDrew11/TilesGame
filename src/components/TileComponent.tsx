import { useCallback } from "react";
import type { Tile } from "../types/types";

type TileProps = {
  tile: Tile;
  onTileClick: (id: number) => void;
  disabled: boolean;
};

const TileComponent = ({ tile, onTileClick, disabled }: TileProps) => {
  const handleTileClick = useCallback(() => {
    if (!disabled && tile.state === "hidden") {
      onTileClick(tile.id);
    }
  }, [disabled, tile.state, tile.id, onTileClick]);

  const getTileClass = (): string => {
    const baseClass = "tile";
    switch (tile?.state) {
      case "matched":
        return `${baseClass} tile--matched`;
      case "revealed":
        return `${baseClass} tile--revealed`;
      default:
        return `${baseClass} tile--hidden`;
    }
  };

  return (
    <button
      onClick={handleTileClick}
      className={getTileClass()}
      disabled={disabled || tile.state !== "hidden"}
      aria-label={
        tile.state !== "hidden" ? `Tile ${tile.value}` : "Hidden tile"
      }
    >
      {tile.state !== "hidden" ? tile.value : "?"}
    </button>
  );
};

export default TileComponent;

import { useCallback } from "react";
import type { Tile } from "../types/types";
import type { Theme } from "../themes";

type TileProps = {
  tile: Tile;
  onTileClick: (id: number) => void;
  disabled: boolean;
  theme: Theme;
  enableAnimations: boolean;
};

const TileComponent = ({
  tile,
  onTileClick,
  disabled,
  theme,
  enableAnimations,
}: TileProps) => {
  const handleTileClick = useCallback(() => {
    if (!disabled && tile.state === "hidden") {
      onTileClick(tile.id);
    }
  }, [disabled, tile.state, tile.id, onTileClick]);

  const getTileStyles = () => {
    const baseStyles = {
      animationDelay: enableAnimations
        ? `${(tile.animationDelay || 0) * 1000}ms`
        : "0ms",
    };

    switch (tile.state) {
      case "matched":
        return { ...baseStyles, background: theme.tileMatched };
      case "revealed":
        return { ...baseStyles, background: theme.tileRevealed };
      case "mismatched":
        return { ...baseStyles, background: theme.tileMismatched };
      default:
        return { ...baseStyles, background: theme.tileHidden };
    }
  };

  console.log(tile.state);

  return (
    <button
      onClick={handleTileClick}
      className={`tile tile--${tile.state} ${
        enableAnimations ? "tile--animated" : ""
      }`}
      style={getTileStyles()}
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

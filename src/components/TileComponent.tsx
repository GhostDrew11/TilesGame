import type { ThemeKey } from "../themes";
import type { Tile } from "../types/types";

type TileProps = {
  tile: Tile;
  onTileClick: (id: number) => void;
  disabled: boolean;
  theme: ThemeKey;
  enabledAnimations: boolean;
};

const TileComponent = ({
  tile,
  onTileClick,
  disabled,
  theme,
  enabledAnimations,
}: TileProps) => {
  const handleTileClick = () => {
    if (!disabled && tile.state === "hidden") {
      onTileClick(tile.id);
    }
  };

  const getTileClass = (): string => {
    const baseClass = "tile";
    const animationsClass = enabledAnimations ? "tile--animated" : "";
    return `${baseClass} ${animationsClass} tile--${tile.state}`;
  };

  if (tile.pairId < 0) {
    return <div className="tile tile--empty"></div>;
  }

  return (
    <button
      onClick={handleTileClick}
      className={getTileClass()}
      disabled={disabled || tile.state !== "hidden"}
      style={{
        animationDelay: enabledAnimations
          ? `${(tile.animationDelay || 0) * 1000}ms`
          : "0ms",
      }}
    >
      {tile.state !== "hidden" ? (
        <span className="tile-content">{tile.emoji}</span>
      ) : (
        <span className="tile-question">?</span>
      )}
    </button>
  );
};

export default TileComponent;

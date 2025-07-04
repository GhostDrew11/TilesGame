type GameStatsProps = {
  stats: GameStats;
  config: GameConfig;
  timeRemaining: number;
};

const GameStatsComponent = ({
  stats,
  config,
  timeRemaining,
}: GameStatsProps) => {
  return <div>GameStatsComponent</div>;
};

export default GameStatsComponent;

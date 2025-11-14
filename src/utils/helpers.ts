import type { GameStats, HighScore, PlayerProfile, Tile } from "../types/types";

export const shuffleArray = (tiles: Tile[]): Tile[] => {
  const result = [...tiles];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export const updatedPlayerProfile = (
  profile: PlayerProfile,
  stats: GameStats,
  result: HighScore,
  isWin: boolean,
  winStreak: number
): PlayerProfile => {
  const updatedPlayerProfile = {
    ...profile,
    totalGamesPlayed: profile.totalGamesPlayed + 1,
    totalWins: isWin ? profile.totalWins + 1 : profile.totalWins,
    highestScore: Math.max(profile.highestScore, result.score),
    highestStreak: Math.max(profile.highestStreak, result.maxStreak),
    perfectGames:
      result.accuracy === 100 ? profile.perfectGames + 1 : profile.perfectGames,
    stats: {
      ...profile.stats,
      totalMatches: profile.stats.totalMatches + stats.matches,
      totalMismatches: profile.stats.totalMismatches + stats.mismatches,
      averageAccuracy: Math.round(
        (profile.stats.averageAccuracy * profile.totalGamesPlayed +
          stats.accuracy) /
          (profile.totalGamesPlayed + 1)
      ),
      averageScore: Math.round(
        (profile.stats.averageScore * profile.totalGamesPlayed + result.score) /
          (profile.totalGamesPlayed + 1)
      ),
      fastestWin:
        isWin &&
        (profile.stats.fastestWin === 0 ||
          result.timeElapsed < profile.stats.fastestWin)
          ? result.timeElapsed
          : profile.stats.fastestWin,
      gamesPerDifficulty: {
        ...profile.stats.gamesPerDifficulty,
        [result.difficulty]:
          profile.stats.gamesPerDifficulty[result.difficulty] + 1,
      },
      winStreak: Math.max(profile.stats.winStreak, winStreak),
      currentWinStreak: winStreak,
    },
  };

  return updatedPlayerProfile;
};

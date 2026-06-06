import SteamAPI from "steamapi";

const steam = new SteamAPI(process.env.STEAM_API_KEY ?? "");

const steamId = process.env.STEAM_ID ?? "";

export const getRecentGames = () => steam.getUserRecentGames(steamId);

export const getOwnedGames = () =>
  steam.getUserOwnedGames(steamId, {
    includeAppInfo: true,
    includeExtendedAppInfo: true,
  });

// Returns the user's achievements for a game, or null when the game has no
// achievements or the request fails (e.g. private stats).
export const getGameAchievements = async (appId: number) => {
  try {
    const { achievements } = await steam.getUserAchievements(steamId, appId);
    return achievements;
  } catch {
    return null;
  }
};

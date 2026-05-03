import type { Metadata } from "next";
import type {
  GameInfo,
  GameInfoBasic,
  GameInfoExtended,
  UserPlaytime,
} from "steamapi";

import { PageHeader } from "@/components/page-header";
import { getOwnedGames, getRecentGames } from "@/lib/steam";

import { GameImage } from "./game-image";
import rawMergeMap from "./merge-map.json";

type AnyGameInfo = GameInfo | GameInfoBasic | GameInfoExtended;

export const metadata: Metadata = {
  description: "What I've been playing on Steam.",
  title: "Games | OS1",
};

const mergeMap: Record<number, number[]> = Object.fromEntries(
  Object.entries(rawMergeMap).map(([k, v]) => [Number(k), v])
);

const mergedIds = new Set(Object.values(mergeMap).flat());

const hiddenGames = new Set([1_401_590]);

const formatPlaytime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  if (hours < 1) {
    return `${minutes}m`;
  }
  return `${hours}h`;
};

interface MergedGame {
  game: UserPlaytime<AnyGameInfo>;
  includes: string[];
  totalMinutes: number;
  totalRecentMinutes: number;
  capsuleFilename?: string;
}

const mergeGames = (
  games: UserPlaytime<AnyGameInfo>[],
  capsuleFilenames: Map<number, string | undefined>
): MergedGame[] => {
  const byId = new Map(games.map((g) => [g.game.id, g]));

  const merged: MergedGame[] = [];

  for (const game of games) {
    if (mergedIds.has(game.game.id) || hiddenGames.has(game.game.id)) {
      continue;
    }

    const entry: MergedGame = {
      capsuleFilename:
        capsuleFilenames.get(game.game.id) ??
        ("capsuleFilename" in game.game
          ? game.game.capsuleFilename
          : undefined),
      game,
      includes: [],
      totalMinutes: game.minutes,
      totalRecentMinutes: game.recentMinutes,
    };

    const children = mergeMap[game.game.id];
    if (children) {
      for (const childId of children) {
        const child = byId.get(childId);
        if (child) {
          entry.includes.push(child.game.name);
          entry.totalMinutes += child.minutes;
          entry.totalRecentMinutes += child.recentMinutes;
        }
      }
    }

    merged.push(entry);
  }

  return merged;
};

const Game = ({ game }: { game: MergedGame }) => (
  <a
    href={`https://store.steampowered.com/app/${game.game.game.id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center flex-row gap-4 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent"
  >
    <GameImage
      id={game.game.game.id}
      name={game.game.game.name}
      capsuleFilename={game.capsuleFilename}
    />
    <div className="flex-1 min-w-0">
      <p className="font-medium">{game.game.game.name}</p>
      {game.includes.length > 0 && (
        <p className="text-xs text-muted-foreground truncate">
          incl. {game.includes.join(", ")}
        </p>
      )}
    </div>
    <p className="shrink-0 text-sm text-muted-foreground">
      {formatPlaytime(game.totalRecentMinutes)} recently
      {" / "}
      {formatPlaytime(game.totalMinutes)} total
    </p>
  </a>
);

const GamesPage = async () => {
  const [recentGames, ownedGames] = await Promise.all([
    getRecentGames(),
    getOwnedGames(),
  ]);

  const capsuleFilenames = new Map(
    ownedGames
      .filter(
        (g): g is UserPlaytime<GameInfoExtended> => "capsuleFilename" in g.game
      )
      .map((g) => [g.game.id, g.game.capsuleFilename])
  );

  const allGames = mergeGames(
    ownedGames as UserPlaytime<AnyGameInfo>[],
    capsuleFilenames
  ).filter((g) => g.totalMinutes > 0);
  const sortedGames = allGames.toSorted(
    (a, b) => b.totalMinutes - a.totalMinutes
  );

  const recentMerged = mergeGames(
    recentGames as UserPlaytime<AnyGameInfo>[],
    capsuleFilenames
  ).filter((g) => g.totalRecentMinutes > 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Games"
        description={
          <>
            What I&apos;ve been playing on Steam. {ownedGames.length} games
            owned.
          </>
        }
      />

      {recentMerged.length > 0 && (
        <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              Recently Played
            </h2>
          </div>
          <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
            {recentMerged.map((game) => (
              <Game game={game} key={game.game.game.id} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
        <div className="px-4 pt-2 pb-1">
          <h2 className="text-sm font-medium text-muted-foreground">
            Most Played
          </h2>
        </div>
        <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
          {sortedGames.map((game) => (
            <Game game={game} key={game.game.game.id} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GamesPage;

import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/page-header";
import { getMyPlaylists, getSavedAlbums } from "@/lib/spotify";

export const metadata: Metadata = {
  description: "What I've been listening to on Spotify.",
  title: "Music | OS1",
};

const MusicPage = async () => {
  const [playlists, savedAlbums] = await Promise.all([
    getMyPlaylists(),
    getSavedAlbums(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Music"
        description="What I've been listening to on Spotify."
      />

      {savedAlbums.length > 0 && (
        <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              Saved Albums
            </h2>
          </div>
          <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
            {savedAlbums.map((album) => (
              <a
                key={album.id}
                href={album.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent"
              >
                {album.images[0] && (
                  <Image
                    src={album.images[0].url}
                    alt={album.name}
                    className="size-10 rounded"
                    width={40}
                    height={40}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {album.name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {album.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {album.total_tracks} tracks
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
        <div className="px-4 pt-2 pb-1">
          <h2 className="text-sm font-medium text-muted-foreground">
            Playlists
          </h2>
        </div>
        <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
          {playlists.map((playlist) => (
            <a
              key={playlist.id}
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent"
            >
              {playlist.images[0] && (
                <Image
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="size-10 rounded"
                  width={40}
                  height={40}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {playlist.name}
                </p>
                {playlist.description && (
                  <p className="truncate text-sm text-muted-foreground">
                    {playlist.description}
                  </p>
                )}
              </div>
              <p className="shrink-0 text-sm text-muted-foreground">
                {playlist.tracks?.total ?? 0} tracks
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MusicPage;

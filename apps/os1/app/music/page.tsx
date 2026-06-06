import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@haydenbleasel/design-system/components/ui/tabs";
import type { Metadata } from "next";
import Image from "next/image";

import { PageBody, PageHeader } from "@/components/page-header";
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
    <Tabs defaultValue="playlists">
      <PageHeader title="Music" withTabs>
        <TabsList className="gap-4" variant="line">
          <TabsTrigger className="flex-none px-0 font-normal" value="playlists">
            Playlists
          </TabsTrigger>
          <TabsTrigger className="flex-none px-0 font-normal" value="albums">
            Saved Albums
          </TabsTrigger>
        </TabsList>
      </PageHeader>

      <PageBody>
        <TabsContent value="playlists">
          <div className="-ml-3 -mt-2 grid gap-2">
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
        </TabsContent>

        <TabsContent value="albums">
          <div className="-ml-3 -mt-2 grid gap-2">
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
        </TabsContent>
      </PageBody>
    </Tabs>
  );
};

export default MusicPage;

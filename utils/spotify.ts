import SpotifyWebApi from "spotify-web-api-node";

interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: null;
    url: string;
    width: null;
  }[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    total: number;
  };
  type: string;
  uri: string;
}

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

async function fetchPlaylist(id: string) {
  const { body } = await spotifyApi.getPlaylistTracks(id);
  let duration = 0;

  const allArtists = body.items
    .map(({ track }) => {
      duration += track.duration_ms;
      const artistsArray = track.artists.map(({ name }) => name.split(","));

      return artistsArray.flat();
    })
    .flat();

  const sorted: any[] = [];

  allArtists.forEach((artist: any) => {
    const currentArtist = sorted.findIndex(({ name }) => name === artist);

    if (currentArtist === -1) {
      sorted.push({
        name: artist,
        count: 1,
      });
    } else {
      sorted[currentArtist].count += 1;
    }
  });

  sorted.sort((a: any, b: any) => (b.count > a.count ? 1 : -1));

  const artistsMap = sorted
    .map(({ name }) => name)
    .slice(0, 8);
  
  const artists = artistsMap.slice(0, -1).join(", ") + " and " + artistsMap.slice(-1);

  return {
    id,
    duration,
    artists,
  };
}

export async function getPlaylists() {
  const grant = await spotifyApi.clientCredentialsGrant();

  spotifyApi.setAccessToken(grant.body.access_token);

  const { body } = await spotifyApi.getUserPlaylists("haydenbleasel");

  const playlistData = await Promise.all(
    body.items.map(({ id }) => fetchPlaylist(id))
  );

  const playlists = body.items.map(
    ({ external_urls, id, images, name, tracks }: Playlist) => {
      const data: any = playlistData.find((pl: any) => pl.id === id);

      return {
        id,
        name,
        url: external_urls.spotify,
        image: images[0].url,
        tracks: tracks.total,
        duration: data.duration,
        artists: `Featuring ${data.artists}.`,
      };
    }
  );

  return playlists;
}

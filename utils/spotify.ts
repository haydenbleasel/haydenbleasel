import he from "he";
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

export async function getPlaylists() {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  });

  const grant = await spotifyApi.clientCredentialsGrant();

  spotifyApi.setAccessToken(grant.body.access_token);

  const { body } = await spotifyApi.getUserPlaylists("haydenbleasel");

  const playlists = body.items.map(
    ({ description, external_urls, id, images, name, tracks }: Playlist) => ({
      id,
      name,
      description: he.decode(description),
      url: external_urls.spotify,
      image: images[0].url,
      tracks: tracks.total,
    })
  );

  return playlists;
}

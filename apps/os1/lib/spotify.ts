import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { AccessToken } from "@spotify/web-api-ts-sdk";

const clientId = process.env.SPOTIFY_CLIENT_ID ?? "";
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN ?? "";

const refreshAccessToken = async (): Promise<AccessToken> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify token error: ${response.status} ${error}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    refresh_token: refreshToken,
    token_type: data.token_type,
  };
};

const getClient = async () => SpotifyApi.withAccessToken(clientId, await refreshAccessToken());

const decodeHtmlEntities = (text: string) =>
  text
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");

export const getTopTracks = async () => {
  const sdk = await getClient();
  const data = await sdk.currentUser.topItems("tracks", "medium_term", 20);
  return data.items;
};

export const getTopArtists = async () => {
  const sdk = await getClient();
  const data = await sdk.currentUser.topItems("artists", "medium_term", 20);
  return data.items;
};

export const getCurrentlyPlaying = async () => {
  const sdk = await getClient();
  return sdk.player.getCurrentlyPlayingTrack();
};

export const getMyPlaylists = async () => {
  const sdk = await getClient();
  const [data, profile] = await Promise.all([
    sdk.currentUser.playlists.playlists(50),
    sdk.currentUser.profile(),
  ]);

  return data.items
    .filter((playlist) => playlist.owner.id === profile.id && playlist.public)
    .map((playlist) => ({
      ...playlist,
      description: decodeHtmlEntities(playlist.description),
    }));
};

export const getSavedAlbums = async () => {
  const sdk = await getClient();
  const data = await sdk.currentUser.albums.savedAlbums(50);
  return data.items.map((item) => item.album);
};

import { afterEach, describe, expect, mock, test } from "bun:test";

const originalFetch = globalThis.fetch;

type RouteHandler = () => Response;

const buildFetchMock = (routes: [pattern: string, handler: RouteHandler][]) =>
  mock((input: string | URL | Request) => {
    const u = input.toString();

    for (const [pattern, handler] of routes) {
      if (u.includes(pattern)) {
        return handler();
      }
    }

    return new Response("Not Found", { status: 404 });
  });

const tokenOk: [string, RouteHandler] = [
  "accounts.spotify.com/api/token",
  () =>
    Response.json({
      access_token: "fake-token",
      expires_in: 3600,
      token_type: "Bearer",
    }),
];

describe("spotify", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("getMyPlaylists decodes HTML entities and filters non-public or non-owned", async () => {
    globalThis.fetch = buildFetchMock([
      tokenOk,
      [
        "/me/playlists",
        () =>
          Response.json({
            items: [
              {
                description: "He said &quot;hi&quot; &amp; left &lt;3 &gt; &#x27;ok&#x27;",
                external_urls: { spotify: "" },
                id: "1",
                images: [],
                name: "Mine",
                owner: { id: "user-123" },
                public: true,
                tracks: { total: 0 },
              },
              {
                description: "",
                external_urls: { spotify: "" },
                id: "2",
                images: [],
                name: "Other",
                owner: { id: "someone-else" },
                public: true,
                tracks: { total: 0 },
              },
              {
                description: "",
                external_urls: { spotify: "" },
                id: "3",
                images: [],
                name: "Private",
                owner: { id: "user-123" },
                public: false,
                tracks: { total: 0 },
              },
            ],
          }),
      ],
      ["/me", () => Response.json({ id: "user-123" })],
    ]) as unknown as typeof fetch;

    const { getMyPlaylists } = await import("../lib/spotify");
    const playlists = await getMyPlaylists();

    expect(playlists).toHaveLength(1);
    expect(playlists[0]?.id).toBe("1");
    expect(playlists[0]?.description).toBe("He said \"hi\" & left <3 > 'ok'");
  });

  test("getSavedAlbums unwraps album entries from the saved-items envelope", async () => {
    globalThis.fetch = buildFetchMock([
      tokenOk,
      [
        "/me/albums",
        () =>
          Response.json({
            items: [
              {
                added_at: "2026-01-01",
                album: {
                  artists: [{ id: "a1", name: "Artist" }],
                  external_urls: { spotify: "" },
                  id: "album-1",
                  images: [],
                  name: "An Album",
                  total_tracks: 10,
                },
              },
            ],
          }),
      ],
    ]) as unknown as typeof fetch;

    const { getSavedAlbums } = await import("../lib/spotify");
    const albums = await getSavedAlbums();

    expect(albums).toHaveLength(1);
    expect(albums[0]?.id).toBe("album-1");
  });

  test("throws when the token endpoint fails", async () => {
    globalThis.fetch = buildFetchMock([
      ["accounts.spotify.com/api/token", () => new Response("invalid_grant", { status: 400 })],
    ]) as unknown as typeof fetch;

    const { getTopTracks } = await import("../lib/spotify");

    expect(getTopTracks()).rejects.toThrow(/Spotify token error: 400/);
  });
});

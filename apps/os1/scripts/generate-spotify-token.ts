#!/usr/bin/env bun
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ENV_PATH = join(import.meta.dir, "..", ".env.local");
const PORT = 3001;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
  "user-top-read",
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
  "user-library-read",
].join(" ");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!(clientId && clientSecret)) {
  console.error(
    "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local"
  );
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("scope", SCOPES);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("state", state);

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

const exchangeCode = async (code: string): Promise<TokenResponse> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      `Token exchange failed: ${response.status} ${await response.text()}`
    );
  }

  return (await response.json()) as TokenResponse;
};

const updateEnvFile = async (refreshToken: string) => {
  const contents = await readFile(ENV_PATH, "utf-8");
  const line = `SPOTIFY_REFRESH_TOKEN="${refreshToken}"`;
  const next = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(contents)
    ? contents.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line)
    : `${contents.replace(/\s*$/, "")}\n${line}\n`;
  await writeFile(ENV_PATH, next);
};

type CallbackOutcome =
  | { kind: "ignore"; response: Response }
  | { kind: "success"; response: Response; tokens: TokenResponse }
  | { kind: "failure"; response: Response; error: Error };

const handleCallback = async (request: Request): Promise<CallbackOutcome> => {
  const url = new URL(request.url);
  if (url.pathname !== "/callback") {
    return {
      kind: "ignore",
      response: new Response("Not found", { status: 404 }),
    };
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const spotifyError = url.searchParams.get("error");

  if (spotifyError) {
    return {
      error: new Error(`Spotify returned error: ${spotifyError}`),
      kind: "failure",
      response: new Response(`Error: ${spotifyError}`, { status: 400 }),
    };
  }
  if (returnedState !== state) {
    return {
      error: new Error("State mismatch"),
      kind: "failure",
      response: new Response("State mismatch", { status: 400 }),
    };
  }
  if (!code) {
    return {
      error: new Error("Missing authorization code"),
      kind: "failure",
      response: new Response("Missing code", { status: 400 }),
    };
  }

  const tokens = await exchangeCode(code).catch((error: Error) => error);
  if (tokens instanceof Error) {
    return {
      error: tokens,
      kind: "failure",
      response: new Response(`Exchange failed: ${tokens.message}`, {
        status: 500,
      }),
    };
  }

  return {
    kind: "success",
    response: new Response(
      "<html><body><h1>Spotify token saved.</h1><p>You can close this tab.</p></body></html>",
      { headers: { "Content-Type": "text/html" } }
    ),
    tokens,
  };
};

const { promise, resolve, reject } = Promise.withResolvers<TokenResponse>();
let settled = false;

const server = Bun.serve({
  async fetch(request) {
    if (settled) {
      return new Response("Already handled", { status: 410 });
    }

    const outcome = await handleCallback(request);

    if (outcome.kind === "success") {
      settled = true;
      resolve(outcome.tokens);
      setTimeout(() => server.stop(), 100);
    } else if (outcome.kind === "failure") {
      settled = true;
      reject(outcome.error);
      setTimeout(() => server.stop(), 100);
    }

    return outcome.response;
  },
  hostname: "127.0.0.1",
  port: PORT,
});

console.log(`Listening on http://127.0.0.1:${PORT}`);
console.log("Make sure this redirect URI is registered in your Spotify app:");
console.log(`  ${REDIRECT_URI}`);
console.log("\nOpen this URL to authorize:");
console.log(authUrl.toString());

try {
  await Bun.spawn(["open", authUrl.toString()]).exited;
} catch {
  // ignore — user can open the URL manually
}

const tokens = await promise;
await updateEnvFile(tokens.refresh_token);
console.log("\nWrote SPOTIFY_REFRESH_TOKEN to .env.local");

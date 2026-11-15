// Runs before every test file. Astro supplies these virtual modules during
// builds and development; tests get small stand-ins instead.
import { mock } from "bun:test";

import { posts } from "../fixtures/content";

export const environment = {
  RESEND_AUDIENCE_ID: "test-audience-id",
  RESEND_TOKEN: "test-token",
};

mock.module("astro:content", () => ({
  // Collections are plain config objects, so tests can reach the schema.
  defineCollection: <T>(collection: T) => collection,
  getCollection: () => Promise.resolve(posts),
}));

mock.module("astro:env/server", () => environment);

// The Worker's bindings. Tests swap `limit` to exercise the rate limiter.
export const bindings = {
  ASSETS: {
    fetch: mock((_input: URL | string) =>
      Promise.resolve(
        new Response("<h1>Page not found</h1>", {
          headers: { "content-type": "text/html; charset=utf-8" },
        })
      )
    ),
  },
  SUBSCRIBE_LIMITER: { limit: mock(() => Promise.resolve({ success: true })) },
};

mock.module("cloudflare:workers", () => ({ env: bindings }));

mock.module("astro:middleware", () => ({
  defineMiddleware: <T>(handler: T) => handler,
}));

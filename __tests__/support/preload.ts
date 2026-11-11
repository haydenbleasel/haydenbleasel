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

mock.module("astro:middleware", () => ({
  defineMiddleware: <T>(handler: T) => handler,
}));

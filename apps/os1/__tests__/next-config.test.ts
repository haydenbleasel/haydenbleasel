import { describe, expect, test } from "bun:test";

import nextConfig from "../next.config";

describe("next.config", () => {
  test("enables turbopack filesystem cache for dev", () => {
    expect(nextConfig.experimental?.turbopackFileSystemCacheForDev).toBe(true);
  });

  test("declares remote image patterns", () => {
    const patterns = nextConfig.images?.remotePatterns ?? [];

    expect(Array.isArray(patterns)).toBe(true);
    expect(patterns.length).toBeGreaterThan(0);
  });

  test("includes image hosts for each integration", () => {
    const hostnames = (nextConfig.images?.remotePatterns ?? []).map((p) => p.hostname);

    expect(hostnames).toContain("cdn.cloudflare.steamstatic.com");
    expect(hostnames).toContain("*.scdn.co");
    expect(hostnames).toContain("avatars.githubusercontent.com");
    expect(hostnames).toContain("oku.ams3.cdn.digitaloceanspaces.com");
  });
});

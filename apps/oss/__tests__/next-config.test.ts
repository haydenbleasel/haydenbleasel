import { describe, expect, test } from "bun:test";

import nextConfig from "../next.config";

describe("next.config", () => {
  test("enables app build optimizations", () => {
    expect(nextConfig.experimental?.inlineCss).toBe(true);
    expect(nextConfig.experimental?.turbopackFileSystemCacheForDev).toBe(true);
  });
});

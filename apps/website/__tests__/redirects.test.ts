import { describe, expect, test } from "bun:test";

import vercelConfig from "../vercel.json";

interface Redirect {
  destination: string;
  permanent?: boolean;
  source: string;
}

const redirects = vercelConfig.redirects as Redirect[];
const bySource = (source: string) => redirects.find((r) => r.source === source);

describe("vercel.json redirects", () => {
  test("cover expected legacy routes", () => {
    const sources = redirects.map((r) => r.source);

    expect(sources).toContain("/blog/:path*");
    expect(sources).toContain("/clients");
    expect(sources).toContain("/work/:path*");
    expect(sources).toContain("/games");
    expect(sources).toContain("/stack");
  });

  test("legacy content routes redirect home permanently", () => {
    for (const source of ["/blog/:path*", "/clients", "/work/:path*"]) {
      expect(bySource(source)?.destination).toBe("/");
      expect(bySource(source)?.permanent).toBe(true);
    }
  });

  test("games and stack redirect to os1", () => {
    expect(bySource("/games")?.destination).toContain("os1.haydenbleasel.com");
    expect(bySource("/stack")?.destination).toContain("os1.haydenbleasel.com");
  });
});

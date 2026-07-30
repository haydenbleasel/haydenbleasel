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
  });

  test("legacy content routes redirect home permanently", () => {
    for (const source of ["/blog/:path*", "/clients"]) {
      expect(bySource(source)?.destination).toBe("/");
      expect(bySource(source)?.permanent).toBe(true);
    }
  });

  test("os1 routes map to their new homes", () => {
    expect(bySource("/appearances")?.destination).toBe("/speaking");
    expect(bySource("/projects")?.destination).toBe("/about");
    expect(bySource("/stack")?.destination).toBe("/about");
    expect(bySource("/work/:path*")?.destination).toBe("/about");
    expect(bySource("/posts")?.destination).toBe("https://x.com/haydenbleasel");
    expect(bySource("/code")?.destination).toBe(
      "https://github.com/haydenbleasel"
    );
  });

  test("unported os1 routes fall back to home", () => {
    for (const source of ["/games", "/books", "/music", "/saved"]) {
      expect(bySource(source)?.destination).toBe("/");
      expect(bySource(source)?.permanent).toBe(false);
    }
  });

  test("no redirect points at the os1 domain", () => {
    for (const redirect of redirects) {
      expect(redirect.destination).not.toContain("os1.haydenbleasel.com");
    }
  });
});

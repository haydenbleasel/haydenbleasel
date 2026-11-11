import { describe, expect, test } from "bun:test";

import { redirects } from "../src/lib/redirects";

const bySource = (source: string) => redirects.find((r) => r.source === source);

describe("redirects", () => {
  test("cover expected legacy routes", () => {
    const sources = redirects.map((r) => r.source);

    expect(sources).toContain("/blog");
    expect(sources).toContain("/clients");
    expect(sources).toContain("/work/:path*");
  });

  test("the old blog index leads to writing without redirecting unknown posts home", () => {
    expect(bySource("/blog")?.destination).toBe("/writing");
    expect(bySource("/blog")?.permanent).toBe(true);
    expect(bySource("/blog/:path*")).toBeUndefined();
    expect(bySource("/clients")?.destination).toBe("/");
    expect(bySource("/clients")?.permanent).toBe(true);
  });

  test("os1 routes map to their new homes", () => {
    expect(bySource("/appearances")?.destination).toBe("/speaking");
    expect(bySource("/projects")?.destination).toBe("/about#projects");
    expect(bySource("/stack")?.destination).toBe("/about#stack");
    expect(bySource("/work/:path*")?.destination).toBe("/about#work");
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

  test("/contact, which other repos link to, temporarily goes to X", () => {
    expect(bySource("/contact")).toEqual({
      destination: "https://x.com/haydenbleasel",
      permanent: false,
      source: "/contact",
    });
  });

  test("no redirect points at the os1 domain", () => {
    for (const redirect of redirects) {
      expect(redirect.destination).not.toContain("os1.haydenbleasel.com");
    }
  });
});

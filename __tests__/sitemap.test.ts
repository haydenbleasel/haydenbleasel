import { describe, expect, test } from "bun:test";

import { posts } from "./fixtures/content";

const { GET } = await import("../src/pages/sitemap.xml");
const call = () => GET({} as unknown as Parameters<typeof GET>[0]);

describe("sitemap", () => {
  test("returns xml", async () => {
    const response = await call();

    expect(response.headers.get("content-type")).toContain("application/xml");
    await response.text();
  });

  test("contains url entries", async () => {
    const response = await call();
    const body = await response.text();

    expect(body).toContain("<urlset");
    expect(body).toContain("<loc>");
  });

  test("only uses explicit editorial dates for lastmod", async () => {
    const response = await call();
    const body = await response.text();

    const entries = [...body.matchAll(/<url>[\s\S]*?<\/url>/gu)].map(
      (match) => match[0]
    );
    const revised = entries.find((entry) =>
      entry.includes("/writing/first-post</loc>")
    );
    expect(revised).toContain("<lastmod>2025-02-01</lastmod>");
    for (const unchangedEntry of entries.filter((entry) => entry !== revised)) {
      expect(unchangedEntry).not.toContain("<lastmod>");
    }
    expect(body).not.toContain("<changefreq>");
    expect(body).not.toContain("<priority>");
  });

  test("contains the durable subpages", async () => {
    const response = await call();
    const body = await response.text();

    for (const route of ["/about", "/writing", "/speaking", "/press"]) {
      expect(body).toContain(`${route}</loc>`);
    }
  });

  test("includes every post's permalink", async () => {
    const response = await call();
    const body = await response.text();

    for (const post of posts) {
      expect(body).toContain(`/writing/${post.id}</loc>`);
    }
  });
});

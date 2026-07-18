import { describe, expect, test } from "bun:test";

import { GET } from "../src/pages/sitemap.xml";

const call = () => GET({} as unknown as Parameters<typeof GET>[0]) as Response;

describe("sitemap", () => {
  test("returns xml", async () => {
    const response = call();

    expect(response.headers.get("content-type")).toContain("application/xml");
    await response.text();
  });

  test("contains a url entry with required fields", async () => {
    const body = await call().text();

    expect(body).toContain("<urlset");
    expect(body).toContain("<loc>");
    expect(body).toContain("<changefreq>monthly</changefreq>");
    expect(body).toContain("<priority>1.0</priority>");
    expect(body).toContain("<lastmod>");
  });
});

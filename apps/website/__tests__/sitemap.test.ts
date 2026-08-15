import { describe, expect, test } from "bun:test";

import { GET } from "../src/pages/sitemap.xml";

const call = () => GET({} as unknown as Parameters<typeof GET>[0]) as Response;

describe("sitemap", () => {
  test("returns xml", async () => {
    const response = call();

    expect(response.headers.get("content-type")).toContain("application/xml");
    await response.text();
  });

  test("contains url entries", async () => {
    const body = await call().text();

    expect(body).toContain("<urlset");
    expect(body).toContain("<loc>");
  });

  test("omits lastmod, changefreq and priority", async () => {
    const body = await call().text();

    // A build-time <lastmod> on every URL is noise crawlers learn to
    // ignore, and Google skips <changefreq>/<priority> outright.
    expect(body).not.toContain("<lastmod>");
    expect(body).not.toContain("<changefreq>");
    expect(body).not.toContain("<priority>");
  });

  test("contains the durable subpages", async () => {
    const body = await call().text();

    for (const route of ["/about", "/writing", "/speaking", "/press"]) {
      expect(body).toContain(`${route}</loc>`);
    }
  });
});

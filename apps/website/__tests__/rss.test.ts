import { describe, expect, test } from "bun:test";

import { writing } from "../src/lib/writing";
import { GET } from "../src/pages/rss.xml";

const call = () => GET({} as unknown as Parameters<typeof GET>[0]) as Response;

describe("rss", () => {
  test("returns an rss content type", async () => {
    const response = call();

    expect(response.headers.get("content-type")).toContain(
      "application/rss+xml"
    );
    await response.text();
  });

  test("contains a channel with a self link", async () => {
    const body = await call().text();

    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain("<channel>");
    expect(body).toContain('rel="self"');
  });

  test("contains an item per writing entry", async () => {
    const body = await call().text();

    expect(body.split("<item>").length - 1).toBe(writing.length);
  });

  test("escapes xml entities", async () => {
    const body = await call().text();

    // Raw ampersands (outside entities) would make the feed invalid.
    expect(body).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/u);
  });
});

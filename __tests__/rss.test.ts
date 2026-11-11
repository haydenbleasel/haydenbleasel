import { describe, expect, test } from "bun:test";

import { writing } from "../src/lib/writing";
import { posts } from "./fixtures/content";

const { GET } = await import("../src/pages/rss.xml");
const call = () => GET({} as unknown as Parameters<typeof GET>[0]);

describe("rss", () => {
  test("returns an rss content type", async () => {
    const response = await call();

    expect(response.headers.get("content-type")).toContain(
      "application/rss+xml"
    );
    await response.text();
  });

  test("contains a channel with a self link", async () => {
    const response = await call();
    const body = await response.text();

    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain("<channel>");
    expect(body).toContain('rel="self"');
  });

  test("contains an item per post and external writing entry", async () => {
    const response = await call();
    const body = await response.text();

    expect(body.split("<item>").length - 1).toBe(posts.length + writing.length);
  });

  test("lists posts newest first and only dates posts", async () => {
    const response = await call();
    const body = await response.text();

    expect(body.indexOf("<title>Second post &amp; more</title>")).toBeLessThan(
      body.indexOf("<title>First post</title>")
    );
    expect(body).toContain("/writing/second-post</link>");
    expect(body).toContain("<pubDate>Fri, 03 Jan 2025 00:00:00 GMT</pubDate>");
    expect(body.split("<pubDate>").length - 1).toBe(posts.length);
  });

  test("escapes xml entities", async () => {
    const response = await call();
    const body = await response.text();

    // Raw ampersands (outside entities) would make the feed invalid.
    expect(body).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/u);
    expect(body).toContain(
      "A description with &lt;markup&gt; &amp; punctuation"
    );
  });
});

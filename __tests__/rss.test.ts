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

  test("dates every item and lists them newest first", async () => {
    const response = await call();
    const body = await response.text();

    expect(body.indexOf("<title>Second post &amp; more</title>")).toBeLessThan(
      body.indexOf("<title>First post</title>")
    );
    expect(body).toContain("/writing/second-post</link>");
    expect(body).toContain("<pubDate>Fri, 03 Jan 2025 00:00:00 GMT</pubDate>");
    expect(body.split("<pubDate>").length - 1).toBe(
      posts.length + writing.length
    );
    const dates = [...body.matchAll(/<pubDate>(?<date>.+?)<\/pubDate>/gu)].map(
      (match) => Date.parse(match.groups?.date ?? "")
    );
    expect(dates).toEqual(dates.toSorted((a, b) => b - a));
  });

  test("dates external writing to the start of its year and names its publisher", async () => {
    const response = await call();
    const body = await response.text();
    const [item] = writing;
    const entry = body.slice(
      body.indexOf(`<title>${item.title}</title>`),
      body.indexOf("</item>", body.indexOf(`<title>${item.title}</title>`))
    );

    expect(entry).toContain(
      `<pubDate>${new Date(Date.UTC(item.year, 0, 1)).toUTCString()}</pubDate>`
    );
    expect(entry).toContain(`<dc:publisher>${item.publisher}</dc:publisher>`);
    expect(body).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    // <source> must link to the publisher's feed, which isn't known.
    expect(body).not.toContain("<source");
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

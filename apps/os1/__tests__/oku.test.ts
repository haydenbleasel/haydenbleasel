import { afterEach, describe, expect, mock, test } from "bun:test";

const sampleXml = `
<rss>
  <channel>
    <item>
      <title>The Pragmatic Programmer</title>
      <link>https://oku.club/book/123</link>
      <description>A great book.</description>
      <dc:creator>David Thomas</dc:creator>
      <pubDate>Thu, 01 Jan 2026 00:00:00 GMT</pubDate>
      <oku:cover>https://example.com/cover.jpg</oku:cover>
    </item>
    <item>
      <title>Domain Driven Design</title>
      <link>https://oku.club/book/456</link>
      <description>Another book.</description>
      <dc:creator>Eric Evans</dc:creator>
      <pubDate>Thu, 02 Jan 2026 00:00:00 GMT</pubDate>
      <enclosure url="https://example.com/ddd.jpg" type="image/jpeg"/>
    </item>
  </channel>
</rss>
`;

const originalFetch = globalThis.fetch;

describe("oku", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("getRead parses items from the RSS feed", async () => {
    globalThis.fetch = mock(
      () => new Response(sampleXml, { status: 200 }),
    ) as unknown as typeof fetch;

    const { getRead } = await import("../lib/oku");
    const items = await getRead();

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      author: "David Thomas",
      cover: "https://example.com/cover.jpg",
      description: "A great book.",
      link: "https://oku.club/book/123",
      title: "The Pragmatic Programmer",
    });
  });

  test("falls back to enclosure url when oku:cover is missing", async () => {
    globalThis.fetch = mock(
      () => new Response(sampleXml, { status: 200 }),
    ) as unknown as typeof fetch;

    const { getReading } = await import("../lib/oku");
    const items = await getReading();

    expect(items[1]?.cover).toBe("https://example.com/ddd.jpg");
  });

  test("returns an empty array when the feed has no items", async () => {
    globalThis.fetch = mock(
      () => new Response("<rss><channel></channel></rss>", { status: 200 }),
    ) as unknown as typeof fetch;

    const { getToRead } = await import("../lib/oku");
    const items = await getToRead();

    expect(items).toEqual([]);
  });

  test("throws when the RSS feed responds with an error", async () => {
    globalThis.fetch = mock(() => new Response("", { status: 500 })) as unknown as typeof fetch;

    const { getToRead } = await import("../lib/oku");

    expect(getToRead()).rejects.toThrow("Oku RSS error: 500");
  });
});

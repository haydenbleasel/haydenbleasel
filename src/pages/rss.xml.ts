import type { APIRoute } from "astro";

import { getPosts, postPath } from "@/lib/posts";
import { url } from "@/lib/url";
import { writing } from "@/lib/writing";

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// External writing is dated to its publication date, or to January 1 of its
// year for the few entries whose pages show no date. Readers stamp an item
// without a pubDate with the time they fetch it, which would list years-old
// articles as the newest. RSS's <source> must point at the publisher's feed,
// which we don't have, so Dublin Core names the publisher instead.
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const postItems = posts.map((post) => {
    const permalink = escapeXml(`${url}${postPath(post.id)}`);
    return {
      date: post.data.date,
      xml: `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${permalink}</link>
      <guid isPermaLink="true">${permalink}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
    </item>`,
    };
  });
  const externalItems = writing.map((item) => {
    const date = item.date
      ? new Date(item.date)
      : new Date(Date.UTC(item.year, 0, 1));
    return {
      date,
      xml: `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${date.toUTCString()}</pubDate>
      <dc:publisher>${escapeXml(item.publisher)}</dc:publisher>
    </item>`,
    };
  });
  const items = [...postItems, ...externalItems]
    .toSorted((a, b) => b.date.getTime() - a.date.getTime())
    .map((item) => item.xml)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Writing by Hayden Bleasel</title>
    <link>${url}/writing</link>
    <description>Articles and long-form writing on design, engineering and developer tools.</description>
    <language>en-us</language>
    <atom:link href="${url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
};

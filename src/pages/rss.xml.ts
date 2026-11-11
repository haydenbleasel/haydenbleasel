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

// External writing only carries a year; only our dated posts get pubDate.
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const postItems = posts.map((post) => {
    const permalink = escapeXml(`${url}${postPath(post.id)}`);
    return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${permalink}</link>
      <guid isPermaLink="true">${permalink}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
    </item>`;
  });
  const externalItems = writing.map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <source url="${escapeXml(item.url)}">${escapeXml(item.publisher)}</source>
    </item>`
  );
  const items = [...postItems, ...externalItems].join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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

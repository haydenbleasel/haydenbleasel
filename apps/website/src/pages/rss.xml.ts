import type { APIRoute } from "astro";

import { url } from "@/lib/url";
import { writing } from "@/lib/writing";

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Writing items only carry a year, so entries omit <pubDate> rather than
// fabricate one; the array is already in reverse-chronological order.
export const GET: APIRoute = () => {
  const items = writing
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <source url="${escapeXml(item.url)}">${escapeXml(item.publisher)}</source>
    </item>`
    )
    .join("\n");

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

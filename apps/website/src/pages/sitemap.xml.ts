import type { APIRoute } from "astro";

import { pages } from "@/lib/pages";
import { url } from "@/lib/url";

export const prerender = true;

// No <lastmod>: a build-time timestamp on every URL claims everything just
// changed on every deploy, which teaches crawlers to ignore it. Google
// ignores <changefreq> and <priority> outright, so they're omitted too.
export const GET: APIRoute = () => {
  const entries = pages
    .map(
      (page) => `  <url>
    <loc>${url}${page.path === "/" ? "" : page.path}</loc>
  </url>`
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(body, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
};

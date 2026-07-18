import type { APIRoute } from "astro";

import { url } from "@/lib/url";

export const prerender = true;

export const GET: APIRoute = () => {
  const lastModified = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return new Response(body, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
};

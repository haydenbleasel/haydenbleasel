import type { APIRoute } from "astro";

import { url } from "@/lib/url";

export const prerender = true;

const routes = ["", "/about", "/writing", "/speaking", "/press"];

export const GET: APIRoute = () => {
  const lastModified = new Date().toISOString();

  const entries = routes
    .map(
      (route) => `  <url>
    <loc>${url}${route}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route === "" ? "1.0" : "0.7"}</priority>
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

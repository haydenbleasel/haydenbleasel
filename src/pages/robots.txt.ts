import type { APIRoute } from "astro";

import { url } from "@/lib/url";

export const prerender = true;

export const GET: APIRoute = () => {
  const sitemap = new URL("/sitemap.xml", url).href;
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemap}`].join(
    "\n"
  );

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};

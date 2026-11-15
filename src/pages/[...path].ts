import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

// Astro only runs middleware for requests that match a route, and answers the
// rest with the prerendered 404 page directly. This route matches every path
// no page or file claims, so the redirects in src/middleware.ts run first.
// Anything they leave gets the 404 page: Astro doesn't substitute it for a 404
// an endpoint returns, so it's read from the static assets here.
export const ALL: APIRoute = async ({ url }) => {
  const page = await env.ASSETS.fetch(new URL("/404", url));
  return new Response(page.body, { headers: page.headers, status: 404 });
};

import type { APIRoute } from "astro";

import { pages } from "@/lib/pages";
import { getPosts, postPath } from "@/lib/posts";
import { url } from "@/lib/url";

export const prerender = true;

// Only explicitly dated editorial updates get <lastmod>, never build times.
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const entries = [
    ...pages.map((page) => ({
      path: page.path,
      updated: undefined as Date | undefined,
    })),
    ...posts.map((post) => ({
      path: postPath(post.id),
      updated: post.data.updated,
    })),
  ]
    .map(
      (page) => `  <url>
    <loc>${url}${page.path === "/" ? "" : page.path}</loc>${page.updated ? `\n    <lastmod>${page.updated.toISOString().slice(0, 10)}</lastmod>` : ""}
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

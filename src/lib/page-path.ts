// Astro's file-format builds expose the output filename in Astro.url.pathname.
// Keep navigation and metadata on the same public URLs in dev and production.
export const pagePath = (pathname: string) =>
  pathname
    .replace(/\/+$/u, "")
    .replace(/\/index\.html$/u, "")
    .replace(/\.html$/u, "") || "/";

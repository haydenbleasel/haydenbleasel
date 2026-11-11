export interface Redirect {
  destination: string;
  permanent: boolean;
  /** Exact path, or a prefix ending in `/:path*` to match everything beneath it. */
  source: string;
}

/** Legacy URLs from earlier versions of the site, applied in middleware. */
export const redirects: Redirect[] = [
  {
    destination: "/og/home.png",
    permanent: true,
    source: "/opengraph-image.png",
  },
  { destination: "/writing", permanent: true, source: "/blog" },
  {
    destination: "/writing/presumi",
    permanent: true,
    source: "/blog/presumi",
  },
  {
    destination: "/writing/jellypepper",
    permanent: true,
    source: "/blog/jellypepper",
  },
  {
    destination: "/writing/jellypepper",
    permanent: true,
    source: "/blog/from-product-designer-to-agency-director",
  },
  {
    destination: "/writing/neutral",
    permanent: true,
    source: "/blog/neutral",
  },
  {
    destination: "/writing/neutral",
    permanent: true,
    source: "/blog/neutral-is-shutting-down",
  },
  {
    destination: "/writing/refraction",
    permanent: true,
    source: "/blog/refraction",
  },
  {
    destination: "/writing/refraction",
    permanent: true,
    source: "/blog/refraction-has-been-acquired-by-twistag",
  },
  { destination: "/", permanent: true, source: "/clients" },
  { destination: "/about#work", permanent: true, source: "/work/:path*" },
  { destination: "/speaking", permanent: true, source: "/appearances" },
  { destination: "/about#projects", permanent: true, source: "/projects" },
  { destination: "/about#stack", permanent: true, source: "/stack" },
  {
    destination: "https://x.com/haydenbleasel",
    permanent: true,
    source: "/posts",
  },
  {
    destination: "https://github.com/haydenbleasel",
    permanent: true,
    source: "/code",
  },
  { destination: "/", permanent: false, source: "/games" },
  { destination: "/", permanent: false, source: "/books" },
  { destination: "/", permanent: false, source: "/music" },
  { destination: "/", permanent: false, source: "/saved" },
];

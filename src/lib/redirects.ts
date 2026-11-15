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
  // This post was first published at the site root, along with its Markdown
  // copy and social card.
  {
    destination: "/writing/taking-away",
    permanent: true,
    source: "/taking-away",
  },
  {
    destination: "/writing/taking-away.md",
    permanent: true,
    source: "/taking-away.md",
  },
  {
    destination: "/og/writing/taking-away.png",
    permanent: true,
    source: "/og/taking-away.png",
  },
  // Posts and projects under the names earlier versions of the site gave them.
  {
    destination: "/writing/clipchamp",
    permanent: true,
    source: "/blog/clipchamp",
  },
  {
    destination: "/writing/clipchamp",
    permanent: true,
    source: "/case-studies/clipchamp",
  },
  {
    destination: "/writing/spaceship",
    permanent: true,
    source: "/blog/spaceship",
  },
  {
    destination: "/writing/presumi",
    permanent: true,
    source: "/thoughts/presumi",
  },
  { destination: "/writing/presumi", permanent: true, source: "/apps/presumi" },
  { destination: "/writing/neutral", permanent: true, source: "/apps/neutral" },
  {
    destination: "/writing/neutral",
    permanent: true,
    source: "/projects/neutral",
  },
  {
    destination: "/writing/refraction",
    permanent: true,
    source: "/apps/refraction",
  },
  // Harmony was Ultracite's original name.
  {
    destination: "/writing/ultracite",
    permanent: true,
    source: "/projects/harmony",
  },
  // Sections that were renamed or folded into another page.
  { destination: "/writing", permanent: true, source: "/thoughts" },
  { destination: "/writing", permanent: true, source: "/journal" },
  { destination: "/rss.xml", permanent: true, source: "/feed" },
  { destination: "/about#projects", permanent: true, source: "/apps" },
  { destination: "/about#projects", permanent: true, source: "/apps/desync" },
  {
    destination: "/about#work",
    permanent: true,
    source: "/case-studies/brighte",
  },
  {
    destination: "/about#work",
    permanent: true,
    source: "/case-studies/lightswap",
  },
  { destination: "/about#work", permanent: true, source: "/blog/palantir" },
  { destination: "/about#work", permanent: true, source: "/blog/sumry" },
  { destination: "/about#work", permanent: true, source: "/blog/lightswap" },
  { destination: "/speaking", permanent: true, source: "/events" },
  { destination: "/press", permanent: true, source: "/featured" },
  { destination: "/press", permanent: true, source: "/interviews" },
  { destination: "/press", permanent: true, source: "/awards" },
  { destination: "/about", permanent: true, source: "/resume" },
  { destination: "/about", permanent: true, source: "/education" },
  { destination: "/about", permanent: true, source: "/now" },
  { destination: "/", permanent: true, source: "/mailing-list" },
  // A PDF of this UTS article about Presumi used to be hosted here.
  {
    destination:
      "https://www.uts.edu.au/news/2016/06/hard-slog-and-serendipity-path-overnight-success",
    permanent: true,
    source: "/presumi-uts.pdf",
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
  // Linked from the codes of conduct in my other repos. There's no contact page,
  // so send people to DMs on X; temporary so a real page can take over later.
  {
    destination: "https://x.com/haydenbleasel",
    permanent: false,
    source: "/contact",
  },
  { destination: "/", permanent: false, source: "/games" },
  { destination: "/", permanent: false, source: "/books" },
  { destination: "/", permanent: false, source: "/music" },
  { destination: "/", permanent: false, source: "/saved" },
];

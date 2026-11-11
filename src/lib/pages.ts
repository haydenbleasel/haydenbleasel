export interface PageMeta {
  description: string;
  /** Site path, e.g. "/about". */
  path: string;
  /** Filename for the generated OG image: /og/<slug>.png. */
  slug: string;
  /** Page heading — subpages get " | Hayden Bleasel" appended in the document title. */
  title: string;
}

/**
 * Homepage document title. Name first — "Hayden Bleasel" is the query this
 * site ranks for, and the tail gets truncated in SERPs, not the head.
 */
export const homeTitle =
  "Hayden Bleasel — Software Engineer and Product Designer";

export const homeDescription =
  "Australian software engineer and product designer at OpenAI. Creator of Ultracite, Files SDK and Blume, based in San Francisco.";

/**
 * The site's main pages. The sitemap, OG image routes and pages themselves
 * read from this list; the posts collection adds its own sitemap entries.
 */
export const pages: PageMeta[] = [
  {
    description: homeDescription,
    path: "/",
    slug: "home",
    title: "Hayden Bleasel",
  },
  {
    description:
      "Hayden Bleasel’s work at OpenAI, Vercel and Corellium, open-source projects, and education at the University of Technology Sydney.",
    path: "/about",
    slug: "about",
    title: "About",
  },
  {
    description:
      "My articles and long-form writing on design, engineering and developer tools.",
    path: "/writing",
    slug: "writing",
    title: "Writing",
  },
  {
    description:
      "Conference talks, meetups, podcasts, interviews and judging I've done over the years.",
    path: "/speaking",
    slug: "speaking",
    title: "Speaking",
  },
  {
    description: "Press coverage and community mentions of me and my work.",
    path: "/press",
    slug: "press",
    title: "Press",
  },
];

export const getPage = (path: string): PageMeta => {
  const page = pages.find((entry) => entry.path === path);

  if (!page) {
    throw new Error(`Unknown page: ${path}`);
  }

  return page;
};

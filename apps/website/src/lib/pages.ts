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
  "I design and build software on the internet. I’m originally from Sydney, Australia and currently living in San Francisco, California.";

/**
 * Every durable page on the site. The sitemap, the OG image routes and the
 * pages themselves all read from this list so they can never drift apart.
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
      "A bit about me — my background, work, projects and the tools I use daily.",
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
    description:
      "A factual index of independent press coverage of me and my work.",
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

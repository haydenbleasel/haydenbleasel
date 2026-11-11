const PRODUCTION_HOST = "haydenbleasel.com";
// Matches the port in the `dev` script.
const DEVELOPMENT_HOST = "localhost:3010";

// The origin for canonical URLs, the sitemap, the RSS feed and robots.txt.
// SITE_ORIGIN overrides it, either as a host or as a full origin.
export const buildUrl = (
  nodeEnv = process.env.NODE_ENV,
  origin = process.env.SITE_ORIGIN
) => {
  if (origin && /^https?:\/\//u.test(origin)) {
    return origin.replace(/\/+$/u, "");
  }
  const production = nodeEnv === "production";
  const host = origin || (production ? PRODUCTION_HOST : DEVELOPMENT_HOST);

  return `${production ? "https" : "http"}://${host}`;
};

export const url = buildUrl();

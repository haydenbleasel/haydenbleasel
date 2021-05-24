const { createSecureHeaders } = require("next-secure-headers");
const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: "public",
          disable: process.env.NODE_ENV === "development",
          dynamicStartUrl: false,
        },
      },
    ],
    [withBundleAnalyzer],
  ],
  {
    future: {
      webpack5: true,
    },
    images: {
      deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      domains: ["i.scdn.co", "cdn-images-1.medium.com"],
    },
    headers() {
      return [
        {
          source: "/(.*)",
          headers: createSecureHeaders(),
        },
      ];
    },
    redirects() {
      return [
        {
          source: "/about",
          destination: "/",
          permanent: true,
        },
        {
          source: "/blog/how-to-growth-hack-your-resume",
          destination: "/",
          permanent: true,
        },
        {
          source: "/blog",
          destination: "/thoughts",
          permanent: true,
        },
        {
          source: "/blog/:slug",
          destination: "/thoughts/:slug",
          permanent: true,
        },
        {
          source: "/work/presumi",
          destination: "/thoughts/presumi",
          permanent: true,
        },
        {
          source: "/presumi",
          destination: "/thoughts/presumi",
          permanent: true,
        },
        {
          source: "/work/gunmetal",
          destination: "/work#role-gunmetal",
          permanent: true,
        },
        {
          source: "/work/sumry",
          destination: "/work#role-sumry",
          permanent: true,
        },
        {
          source: "/work/palantir",
          destination: "/work#role-palantir",
          permanent: true,
        },
        {
          source: "/work/spaceship",
          destination: "/work#role-spaceship",
          permanent: true,
        },
        {
          source: "/work/jellypepper",
          destination: "https://jellypepper.com/",
          permanent: true,
        },
      ];
    },
  }
);

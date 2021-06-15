const { createSecureHeaders } = require("next-secure-headers");
const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const config = {
  images: {
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: [
      "i.scdn.co",
      "cdn-images-1.medium.com",
      "dev.to",
      "haydenbleasel.cdn.prismic.io",
      "images.prismic.io",
    ],
    loader: "imgix",
    path: "",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders(),
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/events",
        destination: "/about#events",
        permanent: true,
      },
      {
        source: "/blog/how-to-growth-hack-your-resume",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/journal",
        permanent: true,
      },
      {
        source: "/thoughts",
        destination: "/journal",
        permanent: true,
      },
      {
        source: "/work/presumi",
        destination: "https://haydenbleasel.medium.com/presumi-4d4a2ba0fc6c",
        permanent: true,
      },
      {
        source: "/presumi",
        destination: "https://haydenbleasel.medium.com/presumi-4d4a2ba0fc6c",
        permanent: true,
      },
      {
        source: "/work/gunmetal",
        destination: "/work#gunmetal",
        permanent: true,
      },
      {
        source: "/work/sumry",
        destination: "/work#sumry",
        permanent: true,
      },
      {
        source: "/work/palantir",
        destination: "/work#palantir",
        permanent: true,
      },
      {
        source: "/work/spaceship",
        destination: "/work#spaceship",
        permanent: true,
      },
      {
        source: "/work/jellypepper",
        destination: "/work#jellypepper",
        permanent: true,
      },
      {
        source: "/playlists",
        destination: "https://open.spotify.com/user/haydenbleasel",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

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
  config
);

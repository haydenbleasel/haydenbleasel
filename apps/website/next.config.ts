import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  redirects() {
    return [
      { destination: "/", permanent: true, source: "/blog/:path*" },
      { destination: "/", permanent: true, source: "/clients" },
      { destination: "/", permanent: true, source: "/work/:path*" },
      {
        destination: "https://os1.haydenbleasel.com/games",
        permanent: true,
        source: "/games",
      },
      {
        destination: "https://os1.haydenbleasel.com/stack",
        permanent: true,
        source: "/stack",
      },
    ];
  },
};

export default nextConfig;

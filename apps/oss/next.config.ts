import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;

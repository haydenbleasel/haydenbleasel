import type { MetadataRoute } from "next";

import { url } from "@/lib/url";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      allow: "/",
      userAgent: "*",
    },
  ],
  sitemap: new URL("/sitemap.xml", url).href,
});

export default robots;

import type { MetadataRoute } from "next";

import { url } from "@/lib/url";

const sitemap = (): MetadataRoute.Sitemap => [
  {
    changeFrequency: "daily",
    lastModified: new Date(),
    priority: 1,
    url,
  },
];

export default sitemap;

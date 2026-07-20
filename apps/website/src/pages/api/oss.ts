import type { APIRoute } from "astro";

import { getOssProjects } from "@/lib/oss";

export const GET: APIRoute = async () => {
  const projects = await getOssProjects();

  return Response.json(projects, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};

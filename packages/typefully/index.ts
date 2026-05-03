import createClient from "openapi-fetch";

import type { paths } from "./schema";

export type { components, paths } from "./schema";

export const typefully = createClient<paths>({
  baseUrl: "https://api.typefully.com",
  headers: {
    Authorization: `Bearer ${process.env.TYPEFULLY_API_KEY ?? ""}`,
  },
});

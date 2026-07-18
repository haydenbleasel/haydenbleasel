import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

import { url } from "./src/lib/url";

// https://astro.build/config
// Redirects live in vercel.json so they are handled at the platform edge.
export default defineConfig({
  adapter: vercel({
    imageService: true,
    webAnalytics: { enabled: true },
  }),

  env: {
    schema: {
      GITHUB_TOKEN: envField.string({
        access: "secret",
        context: "server",
        optional: true,
      }),
      RESEND_AUDIENCE_ID: envField.string({
        access: "secret",
        context: "server",
      }),
      RESEND_TOKEN: envField.string({ access: "secret", context: "server" }),
    },
  },

  // On-demand rendering; individual pages opt into static via `prerender = true`.
  output: "server",

  site: url,

  vite: {
    plugins: [tailwindcss()],
  },
});

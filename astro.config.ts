import { fileURLToPath } from "node:url";

import cloudflare from "@astrojs/cloudflare";
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

import { externalArticleLinks } from "./src/lib/markdown-external-links";
import { url } from "./src/lib/url";

// https://astro.build/config
// Legacy redirects live in src/lib/redirects.ts and run in middleware.
export default defineConfig({
  adapter: cloudflare({
    imageService: "passthrough",
    prerenderEnvironment: "node",
  }),

  build: {
    // Flat HTML files let the asset host serve our extensionless, slashless URLs.
    format: "file",
    // Ship the CSS inside each page so it can never paint unstyled. Field data
    // showed desktop Chrome occasionally painting before the external
    // stylesheet applied on internal navigations, then snapping into place
    // (CLS ~0.55, 1.0 on About). Inlining also puts the @view-transition opt-in
    // in the head, before Chrome decides whether to run the transition.
    inlineStylesheets: "always",
  },

  env: {
    schema: {
      RESEND_AUDIENCE_ID: envField.string({
        access: "secret",
        context: "server",
        optional: true,
      }),
      RESEND_TOKEN: envField.string({
        access: "secret",
        context: "server",
        optional: true,
      }),
    },
  },

  integrations: [
    {
      hooks: {
        "astro:config:setup": ({ command, updateConfig }) => {
          // Build/type generation must not replace a running preview's chunks.
          updateConfig({
            vite: {
              cacheDir: fileURLToPath(
                new URL(`node_modules/.vite-${command}/`, import.meta.url)
              ),
            },
          });
        },
      },
      name: "website:isolated-vite-cache",
    },
  ],

  markdown: {
    processor: satteri({ hastPlugins: [externalArticleLinks] }),
    shikiConfig: {
      defaultColor: false,
      themes: {
        dark: "github-dark",
        light: "github-light",
      },
    },
  },

  // Build public content once. Only the newsletter endpoint opts into a server.
  output: "static",

  // Nothing uses sessions, so the adapter doesn't need a KV namespace for them.
  session: false,

  site: url,

  trailingSlash: "never",

  vite: {
    // Prebundle imports used by the Workers preview before its first request.
    optimizeDeps: {
      include: [
        "astro/assets/services/noop",
        "astro/logger/json",
        "astro/logger/console",
      ],
    },
    plugins: [tailwindcss()],
  },
});

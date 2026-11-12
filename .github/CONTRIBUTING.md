# Contributing to haydenbleasel.com

This repo is the source for [haydenbleasel.com](https://haydenbleasel.com). It's an [Astro](https://astro.build) site running on [Cloudflare Workers](https://workers.cloudflare.com). Every page is prerendered at build time; the only server route is the newsletter signup.

The root `README.md` is the GitHub profile README for [@haydenbleasel](https://github.com/haydenbleasel), so documentation for the site lives here instead.

## Prerequisites

- Node.js 22.12+ (Astro's CLI runs on Node)
- Bun 1.4.4+

```bash
bun install
```

## Workflow

```bash
bun run dev            # dev server at http://localhost:3010
bun run build          # build the site into dist/
bun run preview        # serve the last build in the local Workers runtime
bun run deploy         # build and deploy to Cloudflare
bun run check          # Ultracite lint + format check
bun run fix            # auto-fix lint + format
bun run types          # astro check
bun run test           # bun test
bun run test:coverage  # bun test --coverage
```

Use `bun run build` rather than `bun build`, which runs Bun's bundler instead of the script.

Coverage is gated at 100% of lines and functions in every TypeScript file under `src/`, and only under `test:coverage` — a plain `bun test` run won't fail on it. `__tests__/modules.test.ts` loads every module, so a new one without tests fails the gate instead of going unreported. Bun can't load `.astro` files, so they're outside what's measured.

A pre-commit hook runs `check`, `test:coverage` and `types`. CI (`.github/workflows/ci.yml`) runs the same on every pull request, plus a build.

## Environment variables

The newsletter signup needs Resend credentials. Locally, put them in `.dev.vars` or `.env` (both are gitignored). Without them, the signup endpoint returns a 503, or redirects a form posted without JavaScript back to the form with an error.

| Variable | Purpose |
| --- | --- |
| `RESEND_TOKEN` | Resend API key |
| `RESEND_AUDIENCE_ID` | The Resend audience new subscribers join |
| `SITE_ORIGIN` | Optional. Overrides the canonical origin, which defaults to `https://haydenbleasel.com` in builds and `http://localhost:3010` in dev |

## Writing posts

Add a Markdown file to `src/content/posts/` with a lowercase, hyphenated filename and this frontmatter:

```yaml
---
title: Your post title
description: A short description for page metadata and the RSS feed.
date: 2026-10-07
---
```

The filename becomes the URL: `streamdown.md` is `/writing/streamdown`. Posts served from the site root instead are listed in `rootPosts` in `src/lib/posts.ts`: `taking-away.md` is `/taking-away`. Every post marks Writing as the current section in the nav, wherever it's served.

The title comes from the frontmatter, so start the body with prose and use `##` for section headings. Images go in `public/images/writing/<post>/`.

Posts are listed newest first on `/writing`, the latest three appear on the homepage, and every post is added to the RSS feed and sitemap automatically. Each post also gets a social card built with Takumi from its title, description and date. It's served at `/og/<post-path>.png` (so `/og/writing/streamdown.png`) and linked in the page's Open Graph, Twitter and article metadata.

For a substantive editorial revision, add `updated: YYYY-MM-DD`. This sets the article's modified-time metadata and the sitemap's `lastmod`, but the post itself only shows the original date. Keep `date` as the original publication date, and never derive `updated` from the build time.

## Other content

Most of the rest of the site comes from typed data in `src/lib/`:

| File | What it drives |
| --- | --- |
| `projects.ts` | Projects on the homepage and the About page |
| `stack.ts` | The stack on the About page |
| `appearances.ts` | Talks, panels and judging on `/speaking`. Entries with an `event` are featured as upcoming until they end |
| `press.ts` | `/press` |
| `writing.ts` | Articles and courses published elsewhere, on `/writing` and in the RSS feed. Give each new entry the publication `date` shown on the article: the feed dates an entry without one to January 1 of its `year` |
| `pages.ts` | Titles and descriptions for each page's metadata and social card |
| `person.ts` | The bio and schema.org `Person` data used in page metadata |
| `redirects.ts` | Redirects for old URLs, applied in `src/middleware.ts` |

The work history on the About page is written directly in `src/pages/about.astro`.

## Conventions

- Code style is enforced by [Ultracite](https://github.com/haydenbleasel/ultracite) (Oxlint and Oxfmt) with its `core` and `astro` presets.
- Pages build as flat HTML files (`build.format: "file"`) and URLs have no trailing slash. `public/_redirects` canonicalizes `.html` and trailing-slash URLs before requests reach the Worker.
- `public/_headers` sets the security headers and the long-lived font cache for static assets. HSTS and `X-Content-Type-Options` are set on the Cloudflare zone, so they also cover responses the Worker generates.
- Put client-side behavior in a `src/lib/` module that the component's `<script>` imports, like `nav-hover.ts` or `stack-tabs.ts`, so it's covered by tests. Logic inside an `.astro` file isn't.
- CSS is inlined into every page (`build.inlineStylesheets: "always"`) rather than loaded as a separate stylesheet. With an external stylesheet, desktop Chrome occasionally painted pages unstyled on internal navigation before snapping into place, a layout shift of about 0.55 (1.0 on About). Keep it inline unless the CSS grows several times larger than its current ~6 KB gzipped.
- Tests live in `__tests__/` and run on `bun:test`. `__tests__/support/preload.ts` stands in for Astro's virtual modules (`astro:content`, `astro:env/server` and `astro:middleware`), and browser scripts are tested against [happy-dom](https://github.com/capricorn86/happy-dom) with the helpers in `__tests__/support/dom.ts`.

## Deployment

The site deploys to Cloudflare Workers as `haydenbleasel-web` and is served on haydenbleasel.com as a Workers Custom Domain (see `wrangler.jsonc`). Pushing to `main` runs the deploy workflow (`.github/workflows/deploy.yml`), which runs the checks, types and tests, then deploys.

The deploy workflow also runs every hour and deploys when an event in `appearances.ts` started or ended in the past two hours. `/speaking` is prerendered, so this is what drops an ended event, or marks one as happening now, for visitors without JavaScript. The page's script does the same in the browser.

The deploy workflow needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. The Resend credentials are set on the Worker itself:

```bash
bunx wrangler secret put RESEND_TOKEN
bunx wrangler secret put RESEND_AUDIENCE_ID
```

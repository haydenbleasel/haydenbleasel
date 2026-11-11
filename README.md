# Hey, I'm Hayden 👋

I'm an Australian Design Engineer based in San Francisco who loves working on open source software for the web.

## Open Source

I originally built [Streamdown](https://github.com/vercel/streamdown), [AI Elements](https://github.com/vercel/ai-elements), [Remend](https://www.npmjs.com/package/remend), [Tersa](https://github.com/vercel-labs/tersa), [OpenReview](https://github.com/vercel-labs/openreview), and [Vectr](https://github.com/vercel-labs/vectr) at Vercel. Now I maintain projects like [Ultracite](https://github.com/haydenbleasel/ultracite), [Files SDK](https://github.com/haydenbleasel/files-sdk) and [Blume](https://github.com/haydenbleasel/blume) personally.

If you like my work and want to [sponsor me](https://github.com/sponsors/haydenbleasel) I'd appreciate it!

## Links

- [Website](https://haydenbleasel.com)
- [Twitter](https://twitter.com/haydenbleasel)

I have a private mailing list on my [website](https://www.haydenbleasel.com). Feel free to join if you're interested.

---

## About this repo

This repo is the source for [haydenbleasel.com](https://haydenbleasel.com). It's an [Astro](https://astro.build) site running on [Cloudflare Workers](https://workers.cloudflare.com). Every page is prerendered at build time; the only server route is the newsletter signup.

### Development

You'll need [Bun](https://bun.sh) and Node.js 22.12 or later, since Astro's CLI runs on Node.

```bash
bun install
bun run dev
```

The dev server runs at [localhost:3010](http://localhost:3010).

| Command                 | What it does                                                |
| ----------------------- | ----------------------------------------------------------- |
| `bun run dev`           | Start the dev server                                        |
| `bun run build`         | Build the site into `dist/`                                 |
| `bun run preview`       | Serve the last build in the local Workers runtime           |
| `bun run deploy`        | Build and deploy to Cloudflare                              |
| `bun run check`         | Lint and check formatting with Ultracite (Oxlint and Oxfmt) |
| `bun run fix`           | Fix lint and formatting issues                              |
| `bun run types`         | Type-check with `astro check`                               |
| `bun run test`          | Run the tests                                               |
| `bun run test:coverage` | Run the tests and fail below 100% coverage                  |

A pre-commit hook runs `check`, `test:coverage` and `types`.

Tests live in `__tests__/` and cover every line and function of the TypeScript in `src/`, which CI enforces. `__tests__/modules.test.ts` loads every module, so a new one without tests fails the gate rather than going unreported. Browser scripts are tested against [happy-dom](https://github.com/capricorn86/happy-dom).

### Environment variables

The newsletter signup needs Resend credentials. Locally, put them in `.dev.vars` or `.env` (both are gitignored). Without them, the signup endpoint returns a 503.

| Variable             | Purpose                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `RESEND_TOKEN`       | Resend API key                                                                                                                       |
| `RESEND_AUDIENCE_ID` | The Resend audience new subscribers join                                                                                             |
| `SITE_ORIGIN`        | Optional. Overrides the canonical origin, which defaults to `https://haydenbleasel.com` in builds and `http://localhost:3010` in dev |

### Writing posts

Add a Markdown file to `src/content/posts/` with a lowercase, hyphenated filename and this frontmatter:

```yaml
---
title: Your post title
description: A short description for page metadata and the RSS feed.
date: 2026-10-07
---
```

The filename becomes the URL: `streamdown.md` is `/writing/streamdown`. Exceptions are defined in `postPath` in `src/lib/posts.ts`: `taking-away.md` is `/taking-away`.

The title comes from the frontmatter, so start the body with prose and use `##` for section headings. Images go in `public/images/writing/<post>/`.

Posts are listed newest first on `/writing`, the latest three appear on the homepage, and every post is added to the RSS feed and sitemap automatically. Each post also gets a social card built with Takumi from its title, description and date. It's served at `/og/<post-path>.png` (so `/og/writing/streamdown.png`) and linked in the page's Open Graph, Twitter and article metadata.

For a substantive editorial revision, add `updated: YYYY-MM-DD`. This sets the article's modified-time metadata and the sitemap's `lastmod`, but the post itself only shows the original date. Keep `date` as the original publication date, and never derive `updated` from the build time.

### Other content

Most of the rest of the site comes from typed data in `src/lib/`:

| File             | What it drives                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| `projects.ts`    | Projects on the homepage and the About page                                                               |
| `stack.ts`       | The stack on the About page                                                                               |
| `appearances.ts` | Talks, panels and judging on `/speaking`. Entries with an `event` are featured as upcoming until they end |
| `press.ts`       | `/press`                                                                                                  |
| `writing.ts`     | Articles and courses published elsewhere, on `/writing` and in the RSS feed                               |
| `pages.ts`       | Titles and descriptions for each page's metadata and social card                                          |
| `person.ts`      | The bio and schema.org `Person` data used in page metadata                                                |
| `redirects.ts`   | Redirects for old URLs, applied in `src/middleware.ts`                                                    |

The work history on the About page is written directly in `src/pages/about.astro`. `public/_redirects` handles URL canonicalization (dropping `.html` and trailing slashes) before requests reach the Worker.

### Deployment

The site deploys to Cloudflare Workers as `haydenbleasel-web` and is served on haydenbleasel.com as a Workers Custom Domain (see `wrangler.jsonc`). Pushing to `main` runs the [Deploy workflow](.github/workflows/deploy.yml), which runs the checks, types and tests, then deploys. Pull requests run the same checks plus a build in [CI](.github/workflows/ci.yml).

The Deploy workflow needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. The Resend credentials are set on the Worker itself:

```bash
bunx wrangler secret put RESEND_TOKEN
bunx wrangler secret put RESEND_AUDIENCE_ID
```

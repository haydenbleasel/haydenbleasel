# haydenbleasel.com (Astro)

An Astro rebuild of my personal website.

Run the development server locally with:

```bash
npm run dev
```

Requires `RESEND_TOKEN` and `RESEND_AUDIENCE_ID` for the newsletter API route
(`.env.local`).

The homepage is prerendered so third-party metrics cannot affect its
availability. Open source metrics are loaded progressively from the cached
`/api/oss` endpoint, which uses a short timeout and omits unavailable values.
Set the optional `GITHUB_TOKEN` to increase GitHub API rate limits.

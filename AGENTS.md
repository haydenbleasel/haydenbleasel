# haydenbleasel.com

The source for [haydenbleasel.com](https://haydenbleasel.com): an Astro 7 site, prerendered at build time and served by the `haydenbleasel-web` Cloudflare Worker. The only on-demand route is `src/pages/api/subscribe.ts`, the newsletter signup, which adds contacts through Resend. This is the `haydenbleasel/haydenbleasel` repo, so `README.md` is Hayden's GitHub profile README: never put repo documentation there. Contributor docs live in `.github/CONTRIBUTING.md`; keep them current when you change commands, structure or deployment.

Commands (from the repo root):

- `bun run dev`: dev server at http://localhost:3010
- `bun run build`: build into `dist/`. Use `bun run build`, not `bun build`, which runs Bun's bundler instead
- `bun run preview`: serve the last build in the local Workers runtime
- `bun run check` / `bun run fix`: lint and format with Ultracite (oxlint + oxfmt)
- `bun run types`: typecheck with `astro check`
- `bun run test` / `bun run test:coverage`: unit tests with `bun test`. The coverage run, which CI, the deploy workflow and the pre-commit hook use, fails unless every line and function of the TypeScript in `src/` is covered

Tests live in `__tests__/`, one file per module. `__tests__/modules.test.ts` imports every module in `src/`, so a new file without tests fails the coverage gate instead of going unreported. `__tests__/support/preload.ts` stands in for Astro's virtual modules (`astro:content` returns `__tests__/fixtures/content.ts`, plus `astro:env/server` and `astro:middleware`). Add stand-ins there rather than calling `mock.module` in a test file: every test file shares one process, so the mock leaks into the rest. Browser scripts are tested against happy-dom: call `useDom()` and use the stubs in `__tests__/support/dom.ts` for media queries, Web Animations, font loading, resize observers and layout boxes. Bun can't load `.astro` files, so put client-side behavior in a `src/lib/` module that the component's `<script>` imports (like `nav-hover.ts`), where it can be tested.

Rendering decisions to keep (the config ones are explained in `astro.config.ts`):

- `build.inlineStylesheets: "always"` ships the CSS inside every page. With an external stylesheet, desktop Chrome occasionally painted pages unstyled on internal navigation and then snapped into place (CLS ~0.55, 1.0 on About). Don't switch back.
- `build.format: "file"` with `trailingSlash: "never"` builds flat `.html` files served without trailing slashes. `public/_redirects` canonicalizes `.html` and trailing-slash URLs before requests reach the Worker.
- Cross-document view transitions are on (`@view-transition` in `src/styles/globals.css`). The inline script in `src/layouts/layout.astro` skips them for keyboard navigation.
- `session: false`: nothing uses Astro sessions, so the Worker has no KV namespace.
- Redirects for old URLs go in `src/lib/redirects.ts`, which `src/middleware.ts` applies, not in `public/_redirects`.
- Response headers for static assets (security headers, the long-lived font cache) live in `public/_headers`. HSTS and `X-Content-Type-Options` are Cloudflare zone settings instead, so they also cover responses the Worker generates; don't add them to `_headers` too.

Posts are Markdown in `src/content/posts/`, with `title`, `description` and `date` frontmatter. Add `updated` only for a substantive editorial revision, and never derive it from the build time. Most other copy is typed data in `src/lib/` (`projects.ts`, `stack.ts`, `appearances.ts`, `press.ts`, `writing.ts`, `person.ts`, `pages.ts`). The writing is Hayden's own: don't rewrite posts or bio copy unless asked. Presumi is a product Hayden created, not a startup Hayden founded.

Every push to `main` runs `.github/workflows/deploy.yml` (check, types, the coverage gate, then `wrangler deploy`), so merging to `main` ships to production. Pull requests run `.github/workflows/ci.yml`. Don't run `bun run deploy` or `wrangler deploy` yourself unless asked. The Resend credentials are Worker secrets set with `wrangler secret put`; the "Missing required secrets" warning during CI builds is expected. Production builds include the Cloudflare Web Analytics beacon (in `src/layouts/layout.astro`), so strip it before loading a build in a test browser, or the test traffic is reported to production analytics.

Dependencies use Bun (see `packageManager`), and Astro's CLI runs on Node.js 22.12+. Some packages only work at matching versions, which is why Dependabot groups them: astro, `@astrojs/*`, satteri and wrangler; tailwindcss and `@tailwindcss/vite`; ultracite, oxlint and oxfmt. `@astrojs/cloudflare`'s Vite plugin pins an exact wrangler, so keep the top-level `wrangler` pin equal to it or two copies of wrangler and workerd get installed. TypeScript stays below 7 because `astro check` needs its JavaScript API.

Commit changes directly to `main`; don't open pull requests on this repo. Never add AI co-author trailers (such as `Co-Authored-By: Claude`) to commits.

# Ultracite Code Standards

Formatting is intentionally handled by your project's configured linter or formatter. Respect the repository's existing quote, width, semicolon, trailing comma, and line ending settings instead of forcing one global formatting style.

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

## Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers — extract constants with descriptive names

## Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

## Async & Promises

- Always `await` promises in async functions — don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

## React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

## Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully — don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

## Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns
- Avoid import cycles; move shared code into a module both sides import

## Security

- Add `rel="noopener noreferrer"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

## Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

## Framework-Specific

**Next.js:** Use `<Image>` component for images. Use `next/head` or the App Router metadata API for head elements. Use Server Components for async data fetching instead of async Client Components.

**React 19+:** Use ref as a prop instead of `React.forwardRef`.

**Solid/Svelte/Vue/Qwik:** Use `class` and `for` attributes (not `className` or `htmlFor`).

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests — use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat — avoid excessive `describe` nesting

## When Your Linter Can't Help

Your configured linter or formatter will catch most mechanical issues automatically. Focus your attention on:

1. Business logic correctness
2. Meaningful naming
3. Architecture decisions
4. Edge cases
5. User experience
6. Documentation for genuinely complex logic

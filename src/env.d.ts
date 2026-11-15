// The Worker's bindings. SUBSCRIBE_LIMITER is declared in wrangler.jsonc and
// matches RateLimiter in src/lib/subscribe.ts; @astrojs/cloudflare adds ASSETS,
// the prerendered site.
declare module "cloudflare:workers" {
  export const env: {
    ASSETS: { fetch: (input: URL | string) => Promise<Response> };
    SUBSCRIBE_LIMITER?: {
      limit: (options: { key: string }) => Promise<{ success: boolean }>;
    };
  };
}

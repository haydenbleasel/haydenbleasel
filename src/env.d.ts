// The Worker's bindings, declared in wrangler.jsonc. SUBSCRIBE_LIMITER matches
// RateLimiter in src/lib/subscribe.ts.
declare module "cloudflare:workers" {
  export const env: {
    SUBSCRIBE_LIMITER?: {
      limit: (options: { key: string }) => Promise<{ success: boolean }>;
    };
  };
}

import type { APIRoute } from "astro";
import { RESEND_AUDIENCE_ID, RESEND_TOKEN } from "astro:env/server";
import { env } from "cloudflare:workers";

import { subscribe } from "@/lib/subscribe";

export const prerender = false;

export const POST: APIRoute = ({ request }) =>
  subscribe(request, {
    audienceId: RESEND_AUDIENCE_ID,
    limiter: env.SUBSCRIBE_LIMITER,
    token: RESEND_TOKEN,
  });

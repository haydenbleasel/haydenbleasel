import { defineMiddleware } from "astro:middleware";

import { redirects } from "@/lib/redirects";

export const onRequest = defineMiddleware((context, next) => {
  const pathname = context.url.pathname.replace(/\/+$/u, "") || "/";
  for (const rule of redirects) {
    const prefix = rule.source.endsWith("/:path*")
      ? rule.source.replace(/\/:path\*$/u, "")
      : null;
    if (
      prefix
        ? pathname === prefix || pathname.startsWith(`${prefix}/`)
        : pathname === rule.source
    ) {
      const destination = new URL(rule.destination, context.url);
      destination.search = context.url.search;
      return context.redirect(destination.href, rule.permanent ? 308 : 307);
    }
  }
  return next();
});

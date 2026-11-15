// The Worker's rate limiting binding (SUBSCRIBE_LIMITER in wrangler.jsonc).
export interface RateLimiter {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
}

interface NewsletterEnvironment {
  audienceId?: string;
  /** Absent in development and tests, where signups aren't limited. */
  limiter?: RateLimiter;
  token?: string;
}

// A field people never see (newsletter-inline.astro hides it). Scripts that
// fill in every input give themselves away by completing it.
export const HONEYPOT_FIELD = "website";

// The page script reads these as JSON. A native form post (without
// JavaScript, or before the script loads) is sent back to the form at
// `#newsletter-<outcome>` instead, where newsletter-inline.astro shows the
// matching message.
export const outcomes = {
  failed: {
    error: "Signup could not be completed. Please try again.",
    message: "",
    status: 502,
  },
  invalid: { error: "Invalid email address", message: "", status: 400 },
  limited: {
    error: "Too many attempts. Please try again in a minute.",
    message: "",
    status: 429,
  },
  subscribed: { error: "", message: "Subscribed!", status: 200 },
  unavailable: {
    error: "Signup is temporarily unavailable. Please try again later.",
    message: "",
    status: 503,
  },
} as const;

type Outcome = keyof typeof outcomes;

// The page the form was on, if it's on this site; otherwise the homepage.
const returnTo = (request: Request) => {
  const { origin } = new URL(request.url);
  try {
    const referrer = new URL(request.headers.get("Referer") ?? "/", origin);
    if (referrer.origin === origin) {
      return referrer;
    }
  } catch {
    // An unparseable Referer falls back to the homepage.
  }
  return new URL("/", origin);
};

// Browsers mark a form they submit themselves as a navigation, and scripts
// can't fake that header. Clients without Fetch Metadata fall back to whether
// they asked for HTML.
const isNavigation = (request: Request) => {
  const mode = request.headers.get("Sec-Fetch-Mode");
  if (mode) {
    return mode === "navigate";
  }
  return request.headers.get("Accept")?.includes("text/html") ?? false;
};

const respond = (request: Request, outcome: Outcome) => {
  const { status, ...body } = outcomes[outcome];
  const headers = {
    "Cache-Control": "no-store",
    Vary: "Accept, Sec-Fetch-Mode",
  };
  if (!isNavigation(request)) {
    return Response.json(body, { headers, status });
  }
  const location = returnTo(request);
  location.hash = `newsletter-${outcome}`;
  return new Response(null, {
    headers: { ...headers, Location: location.href },
    status: 303,
  });
};

export const subscribe = async (
  request: Request,
  environment: NewsletterEnvironment,
  send: typeof fetch = fetch
) => {
  let email: FormDataEntryValue | null;
  let honeypot: FormDataEntryValue | null;
  try {
    const data = await request.formData();
    email = data.get("email");
    honeypot = data.get(HONEYPOT_FIELD);
  } catch {
    return respond(request, "invalid");
  }
  // Tell a bot it worked, so it has no reason to adapt, and add nobody.
  if (honeypot) {
    return respond(request, "subscribed");
  }
  // Counted per visitor address, before validation, so guessing is limited too.
  const address = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const allowed = await environment.limiter?.limit({ key: address });
  if (allowed?.success === false) {
    return respond(request, "limited");
  }
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim())
  ) {
    return respond(request, "invalid");
  }
  // Failures are logged (the Worker has observability on) because a native
  // post's 303 hides them from status-code metrics.
  if (!environment.token || !environment.audienceId) {
    console.error(
      "Newsletter signup unavailable: RESEND_TOKEN or RESEND_AUDIENCE_ID is not set"
    );
    return respond(request, "unavailable");
  }
  try {
    const response = await send("https://api.resend.com/contacts", {
      body: JSON.stringify({
        email: email.trim(),
        segments: [{ id: environment.audienceId }],
        unsubscribed: false,
      }),
      headers: {
        Authorization: `Bearer ${environment.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(
        `Newsletter signup failed: Resend responded ${response.status}`,
        await response.text()
      );
      return respond(request, "failed");
    }
    return respond(request, "subscribed");
  } catch (error) {
    console.error("Newsletter signup failed: Resend request errored", error);
    return respond(request, "failed");
  }
};

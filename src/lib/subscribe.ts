interface NewsletterEnvironment {
  audienceId?: string;
  token?: string;
}

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
  try {
    const data = await request.formData();
    email = data.get("email");
  } catch {
    return respond(request, "invalid");
  }
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim())
  ) {
    return respond(request, "invalid");
  }
  if (!environment.token || !environment.audienceId) {
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
      return respond(request, "failed");
    }
    return respond(request, "subscribed");
  } catch {
    return respond(request, "failed");
  }
};

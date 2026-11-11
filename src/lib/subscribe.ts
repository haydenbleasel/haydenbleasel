interface NewsletterEnvironment {
  audienceId?: string;
  token?: string;
}

const json = (body: { error: string; message: string }, status = 200) =>
  Response.json(body, { headers: { "Cache-Control": "no-store" }, status });

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
    return json({ error: "Invalid email address", message: "" }, 400);
  }
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim())
  ) {
    return json({ error: "Invalid email address", message: "" }, 400);
  }
  if (!environment.token || !environment.audienceId) {
    return json(
      {
        error: "Signup is temporarily unavailable. Please try again later.",
        message: "",
      },
      503
    );
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
      return json(
        {
          error: "Signup could not be completed. Please try again.",
          message: "",
        },
        502
      );
    }
    return json({ error: "", message: "Subscribed!" });
  } catch {
    return json(
      {
        error: "Signup could not be completed. Please try again.",
        message: "",
      },
      502
    );
  }
};

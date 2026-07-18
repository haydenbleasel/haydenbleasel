import type { APIRoute } from "astro";

import { audienceId, resend } from "@/lib/resend";

export const prerender = false;

const json = (body: { error: string; message: string }, status = 200) =>
  Response.json(body, { status });

export const POST: APIRoute = async ({ request }) => {
  let email: FormDataEntryValue | null = null;

  try {
    const formData = await request.formData();
    email = formData.get("email");
  } catch {
    return json({ error: "Invalid email address", message: "" }, 400);
  }

  if (typeof email !== "string") {
    return json({ error: "Invalid email address", message: "" }, 400);
  }

  const response = await resend.contacts.create({
    audienceId,
    email,
    unsubscribed: false,
  });

  if (response.error) {
    return json({ error: response.error.message, message: "" }, 502);
  }

  return json({ error: "", message: "Subscribed!" });
};

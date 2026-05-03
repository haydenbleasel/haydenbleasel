"use server";

import { resend, audienceId } from "@/lib/resend";

export const subscribe = async (
  _prevState: unknown,
  formData: FormData
): Promise<{
  message: string;
  error: string;
}> => {
  const email = formData.get("email");

  if (typeof email !== "string") {
    return { error: "Invalid email address", message: "" };
  }

  const response = await resend.contacts.create({
    audienceId,
    email,
    unsubscribed: false,
  });

  if (response.error) {
    return { error: response.error.message, message: "" };
  }

  return { error: "", message: "Subscribed!" };
};

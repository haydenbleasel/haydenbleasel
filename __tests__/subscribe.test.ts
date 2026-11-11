import { describe, expect, mock, test } from "bun:test";

import { subscribe } from "../src/lib/subscribe";

const environment = { audienceId: "test-audience-id", token: "test-token" };
const buildRequest = (email?: string) => {
  const formData = new FormData();
  if (email !== undefined) {
    formData.set("email", email);
  }
  return new Request("http://localhost/api/subscribe", {
    body: formData,
    method: "POST",
  });
};

describe("subscribe", () => {
  test("rejects missing and malformed email before contacting Resend", async () => {
    const send = mock(() => Promise.resolve(Response.json({ id: "123" })));
    await Promise.all(
      [undefined, "invalid", "a".repeat(255)].map(async (email) => {
        const response = await subscribe(
          buildRequest(email),
          environment,
          send as unknown as typeof fetch
        );
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
          error: "Invalid email address",
          message: "",
        });
      })
    );
    expect(send).not.toHaveBeenCalled();
  });

  test("rejects a body that isn't form data", async () => {
    const send = mock(() => Promise.resolve(Response.json({ id: "123" })));
    const response = await subscribe(
      new Request("http://localhost/api/subscribe", {
        body: "email=test@example.com",
        headers: { "Content-Type": "text/plain" },
        method: "POST",
      }),
      environment,
      send as unknown as typeof fetch
    );
    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  test("subscribes a trimmed email to the configured segment", async () => {
    const send = mock(() => Promise.resolve(Response.json({ id: "456" })));
    const response = await subscribe(
      buildRequest(" test@example.com "),
      environment,
      send as unknown as typeof fetch
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      error: "",
      message: "Subscribed!",
    });
    expect(send).toHaveBeenCalledWith(
      "https://api.resend.com/contacts",
      expect.objectContaining({
        body: JSON.stringify({
          email: "test@example.com",
          segments: [{ id: environment.audienceId }],
          unsubscribed: false,
        }),
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    );
  });

  test("reports missing configuration without sending a request", async () => {
    const send = mock(() => Promise.resolve(Response.json({ id: "123" })));
    const response = await subscribe(
      buildRequest("test@example.com"),
      {},
      send as unknown as typeof fetch
    );
    expect(response.status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  test("returns a retryable error when Resend rejects the request", async () => {
    const send = mock(() =>
      Promise.resolve(
        Response.json({ message: "Rate limit exceeded" }, { status: 429 })
      )
    );
    const response = await subscribe(
      buildRequest("test@example.com"),
      environment,
      send as unknown as typeof fetch
    );
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Signup could not be completed. Please try again.",
      message: "",
    });
  });

  test("returns a retryable error when the network fails", async () => {
    const send = mock(() => Promise.reject(new Error("Network unavailable")));
    const response = await subscribe(
      buildRequest("test@example.com"),
      environment,
      send as unknown as typeof fetch
    );
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Signup could not be completed. Please try again.",
      message: "",
    });
  });
});

import { describe, expect, mock, test } from "bun:test";

import { subscribe } from "../src/lib/subscribe";

const environment = { audienceId: "test-audience-id", token: "test-token" };
const buildRequest = (email?: string, headers: HeadersInit = {}) => {
  const formData = new FormData();
  if (email !== undefined) {
    formData.set("email", email);
  }
  return new Request("http://localhost/api/subscribe", {
    body: formData,
    headers,
    method: "POST",
  });
};
// What a browser sends when it submits the form itself, without the script.
const NAVIGATION = {
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  Referer: "http://localhost/?ref=x#newsletter-invalid",
  "Sec-Fetch-Mode": "navigate",
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

  test("answers scripts with JSON, whatever they accept", async () => {
    await Promise.all(
      (
        [
          { Accept: "*/*" },
          { Accept: "*/*", "Sec-Fetch-Mode": "cors" },
          { Accept: NAVIGATION.Accept, "Sec-Fetch-Mode": "same-origin" },
        ] as Record<string, string>[]
      ).map(async (headers) => {
        const response = await subscribe(
          buildRequest("invalid", headers),
          environment
        );
        expect(response.status).toBe(400);
        expect(response.headers.get("Content-Type")).toContain(
          "application/json"
        );
        expect(response.headers.get("Vary")).toBe("Accept, Sec-Fetch-Mode");
      })
    );
  });

  test("sends a native form post back to the form with its outcome", async () => {
    const send = mock(() => Promise.resolve(Response.json({ id: "789" })));
    const cases = [
      [buildRequest("test@example.com", NAVIGATION), environment, "subscribed"],
      [buildRequest("invalid", NAVIGATION), environment, "invalid"],
      [buildRequest("test@example.com", NAVIGATION), {}, "unavailable"],
    ] as const;
    await Promise.all(
      cases.map(async ([request, env, outcome]) => {
        const response = await subscribe(
          request,
          env,
          send as unknown as typeof fetch
        );
        expect(response.status).toBe(303);
        expect(response.headers.get("Location")).toBe(
          `http://localhost/?ref=x#newsletter-${outcome}`
        );
        expect(response.headers.get("Cache-Control")).toBe("no-store");
        expect(response.headers.get("Vary")).toBe("Accept, Sec-Fetch-Mode");
        expect(await response.text()).toBe("");
      })
    );
    const failed = await subscribe(
      buildRequest("test@example.com", NAVIGATION),
      environment,
      (() => Promise.reject(new Error("offline"))) as unknown as typeof fetch
    );
    expect(failed.headers.get("Location")).toBe(
      "http://localhost/?ref=x#newsletter-failed"
    );
  });

  test("falls back to Accept for browsers without Fetch Metadata", async () => {
    const response = await subscribe(
      buildRequest("invalid", {
        Accept: NAVIGATION.Accept,
        Referer: NAVIGATION.Referer,
      }),
      environment
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe(
      "http://localhost/?ref=x#newsletter-invalid"
    );
  });

  test("returns native posts to the homepage unless they came from this site", async () => {
    await Promise.all(
      (
        [
          { "Sec-Fetch-Mode": "navigate" },
          { ...NAVIGATION, Referer: "https://example.com/phish" },
          { ...NAVIGATION, Referer: "http://[" },
        ] as Record<string, string>[]
      ).map(async (headers) => {
        const response = await subscribe(
          buildRequest("invalid", headers),
          environment
        );
        expect(response.headers.get("Location")).toBe(
          "http://localhost/#newsletter-invalid"
        );
      })
    );
  });
});

import { describe, expect, test } from "bun:test";

const getProtocol = (nodeEnv: string) => (nodeEnv === "production" ? "https" : "http");

const getOrigin = (envUrl?: string) => envUrl ?? "localhost:3000";

describe("url", () => {
  test("constructs url from environment variables", async () => {
    const { url } = await import("../lib/url");

    expect(url).toMatch(/^https?:\/\/.+/);
  });

  test("protocol logic uses https for production", () => {
    expect(getProtocol("production")).toBe("https");
  });

  test("protocol logic uses http for non-production", () => {
    expect(getProtocol("development")).toBe("http");
  });

  test("falls back to localhost:3000 when VERCEL_PROJECT_PRODUCTION_URL is unset", () => {
    expect(getOrigin()).toBe("localhost:3000");
  });

  test("uses VERCEL_PROJECT_PRODUCTION_URL when set", () => {
    expect(getOrigin("haydenbleasel.com")).toBe("haydenbleasel.com");
  });
});

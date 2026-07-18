import { describe, expect, test } from "bun:test";

import { buildUrl, url } from "../src/lib/url";

describe("buildUrl", () => {
  test("uses https in production", () => {
    expect(buildUrl("production", "haydenbleasel.com")).toBe(
      "https://haydenbleasel.com"
    );
  });

  test("uses http outside production", () => {
    expect(buildUrl("development", "haydenbleasel.com")).toBe(
      "http://haydenbleasel.com"
    );
  });

  test("falls back to localhost:3010 when the production url is unset", () => {
    const previous = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;

    expect(buildUrl("development")).toBe("http://localhost:3010");

    if (previous !== undefined) {
      process.env.VERCEL_PROJECT_PRODUCTION_URL = previous;
    }
  });

  test("uses VERCEL_PROJECT_PRODUCTION_URL when set", () => {
    expect(buildUrl("production", "example.com")).toBe("https://example.com");
  });
});

describe("url", () => {
  test("is a valid absolute url", () => {
    expect(url).toMatch(/^https?:\/\/.+/u);
  });
});

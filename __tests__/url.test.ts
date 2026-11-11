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

  test("defaults production canonicals to the public site without hosting variables", () => {
    const previousOrigin = process.env.SITE_ORIGIN;
    delete process.env.SITE_ORIGIN;
    try {
      expect(buildUrl("production")).toBe("https://haydenbleasel.com");
    } finally {
      if (previousOrigin !== undefined) {
        process.env.SITE_ORIGIN = previousOrigin;
      }
    }
  });

  test("uses the given production origin", () => {
    expect(buildUrl("production", "example.com")).toBe("https://example.com");
  });
});

describe("url", () => {
  test("is a valid absolute url", () => {
    expect(url).toMatch(/^https?:\/\/.+/u);
  });
});

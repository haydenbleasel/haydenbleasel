import { describe, expect, test } from "bun:test";

import { buildUrl, url } from "../src/lib/url";

// Runs `check` with SITE_ORIGIN unset, so the defaults apply.
const withoutSiteOrigin = (check: () => void) => {
  const previous = process.env.SITE_ORIGIN;
  delete process.env.SITE_ORIGIN;
  try {
    check();
  } finally {
    if (previous !== undefined) {
      process.env.SITE_ORIGIN = previous;
    }
  }
};

describe("buildUrl", () => {
  test("defaults to the public site in production", () => {
    withoutSiteOrigin(() => {
      expect(buildUrl("production")).toBe("https://haydenbleasel.com");
    });
  });

  test("defaults to the dev server outside production", () => {
    withoutSiteOrigin(() => {
      expect(buildUrl("development")).toBe("http://localhost:3010");
      expect(buildUrl("test")).toBe("http://localhost:3010");
    });
  });

  test("reads SITE_ORIGIN from the environment", () => {
    const previous = process.env.SITE_ORIGIN;
    process.env.SITE_ORIGIN = "preview.haydenbleasel.com";
    try {
      expect(buildUrl("production")).toBe("https://preview.haydenbleasel.com");
    } finally {
      if (previous === undefined) {
        delete process.env.SITE_ORIGIN;
      } else {
        process.env.SITE_ORIGIN = previous;
      }
    }
  });

  test("uses https for a host in production and http elsewhere", () => {
    expect(buildUrl("production", "example.com")).toBe("https://example.com");
    expect(buildUrl("development", "example.com")).toBe("http://example.com");
  });

  test("keeps a full origin's protocol and drops trailing slashes", () => {
    expect(buildUrl("production", "http://localhost:4321/")).toBe(
      "http://localhost:4321"
    );
  });

  test("treats an empty origin as unset", () => {
    expect(buildUrl("production", "")).toBe("https://haydenbleasel.com");
    expect(buildUrl("development", "")).toBe("http://localhost:3010");
  });
});

describe("url", () => {
  test("is a valid absolute url", () => {
    expect(url).toMatch(/^https?:\/\/.+/u);
  });
});

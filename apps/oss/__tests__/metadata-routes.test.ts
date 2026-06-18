import { describe, expect, test } from "bun:test";

import robots from "../app/robots";
import sitemap from "../app/sitemap";

describe("metadata routes", () => {
  test("allows crawlers and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: [
        {
          allow: "/",
          userAgent: "*",
        },
      ],
      sitemap: "http://localhost:3003/sitemap.xml",
    });
  });

  test("includes the homepage in the sitemap", () => {
    const [entry] = sitemap();

    expect(entry?.changeFrequency).toBe("daily");
    expect(entry?.priority).toBe(1);
    expect(entry?.url).toBe("http://localhost:3003");
    expect(entry?.lastModified).toBeInstanceOf(Date);
  });
});

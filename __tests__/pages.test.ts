import { describe, expect, test } from "bun:test";

import { getPage, homeTitle, pages } from "../src/lib/pages";
import { socialImageSlug } from "../src/lib/social-image";

describe("pages", () => {
  test("looks up a page by path", () => {
    expect(getPage("/press")).toMatchObject({ path: "/press", title: "Press" });
  });

  test("throws for a page that doesn't exist", () => {
    expect(() => getPage("/nope")).toThrow("Unknown page: /nope");
  });

  test("each slug is the page's OG image filename", () => {
    for (const page of pages) {
      expect(page.slug).toBe(socialImageSlug(page.path));
    }
  });

  test("paths are unique and the homepage title leads with the name", () => {
    expect(new Set(pages.map((page) => page.path)).size).toBe(pages.length);
    expect(homeTitle.startsWith("Hayden Bleasel")).toBe(true);
  });
});

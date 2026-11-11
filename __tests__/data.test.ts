import { describe, expect, test } from "bun:test";
import path from "node:path";

import { identity, person, primaryPortrait } from "../src/lib/person";
import { press } from "../src/lib/press";
import { projects } from "../src/lib/projects";
import { portraitImage } from "../src/lib/social-image";
import { categories, stack } from "../src/lib/stack";
import { writing } from "../src/lib/writing";

const ROOT = path.join(import.meta.dir, "..");

const duplicates = (values: string[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

// Internal links must point at a post that exists.
const resolves = async (url: string) =>
  url.startsWith("https://") ||
  (url.startsWith("/writing/") &&
    (await Bun.file(
      path.join(ROOT, "src/content/posts", `${url.slice(9)}.md`)
    ).exists()));

describe("person", () => {
  test("every image it lists is in public/", async () => {
    const urls = [...person.image, primaryPortrait.url];
    const exists = await Promise.all(
      urls.map((url) =>
        Bun.file(path.join(ROOT, "public", new URL(url).pathname)).exists()
      )
    );

    for (const url of urls) {
      expect(url.startsWith(identity)).toBe(true);
    }
    expect(exists).toEqual(urls.map(() => true));
    expect(primaryPortrait.url).toBe(`${identity}${portraitImage.path}`);
  });

  test("profiles are unique https URLs", () => {
    expect(duplicates(person.sameAs)).toEqual([]);
    for (const url of person.sameAs) {
      expect(url.startsWith("https://")).toBe(true);
    }
  });
});

describe("projects", () => {
  test("names are unique and links resolve", async () => {
    expect(duplicates(projects.map((project) => project.name))).toEqual([]);
    const resolved = await Promise.all(
      projects.map((project) => resolves(project.url))
    );
    expect(
      projects.filter((_, index) => !resolved[index]).map((p) => p.url)
    ).toEqual([]);
  });

  test("footnotes are numbered from 1 without gaps", () => {
    const footnotes = projects
      .map((project) => project.footnote)
      .filter((footnote) => footnote !== undefined);

    expect(footnotes).toEqual(footnotes.map((_, index) => index + 1));
  });
});

describe("press", () => {
  test("links are unique https URLs", () => {
    expect(duplicates(press.map((item) => item.url))).toEqual([]);
    for (const item of press) {
      expect(item.url.startsWith("https://")).toBe(true);
    }
  });
});

describe("writing", () => {
  // The RSS feed dates entries by `date`, and /writing shows `year`.
  test("publication dates are real days in the entry's year", () => {
    for (const item of writing.filter((entry) => entry.date)) {
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(new Date(`${item.date}T00:00:00Z`).toISOString()).toStartWith(
        `${item.date}T`
      );
      expect(item.date?.slice(0, 4)).toBe(String(item.year));
    }
  });
});

describe("stack", () => {
  // `category` is a plain string, so a typo would silently drop a tool from
  // every tab.
  test("every tool is in a known category", () => {
    const known: readonly string[] = categories;
    for (const item of stack) {
      expect(known).toContain(item.category);
    }
  });

  test("names are unique and links are https", () => {
    expect(duplicates(stack.map((item) => item.name))).toEqual([]);
    for (const item of stack) {
      expect(item.url.startsWith("https://")).toBe(true);
    }
  });
});

import { describe, expect, test } from "bun:test";

import { collections } from "../src/content.config";

const { loader, schema } = collections.posts as unknown as {
  loader: { name: string };
  schema: { parse: (value: unknown) => Record<string, unknown> };
};

const frontmatter = {
  date: "2026-10-07",
  description: "A short description.",
  title: "A post",
};

describe("posts collection", () => {
  test("loads Markdown files with Astro's glob loader", () => {
    expect(loader.name).toBe("glob-loader");
  });

  test("turns frontmatter dates into Dates and leaves updated optional", () => {
    const post = schema.parse(frontmatter);

    expect(post.date).toEqual(new Date("2026-10-07"));
    expect(post.updated).toBeUndefined();
    expect(schema.parse({ ...frontmatter, updated: "2026-11-01" })).toEqual({
      ...frontmatter,
      date: new Date("2026-10-07"),
      updated: new Date("2026-11-01"),
    });
  });

  test("requires a title, description and date", () => {
    for (const field of ["title", "description", "date"] as const) {
      const { [field]: _omitted, ...incomplete } = frontmatter;
      expect(() => schema.parse(incomplete)).toThrow();
    }
  });

  test("rejects dates that aren't dates", () => {
    expect(() => schema.parse({ ...frontmatter, date: "soon" })).toThrow();
  });
});

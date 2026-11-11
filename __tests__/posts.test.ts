import { describe, expect, test } from "bun:test";

import { formatPostDate, getPosts, postPath } from "../src/lib/posts";

describe("posts", () => {
  test("lists posts newest first", async () => {
    const posts = await getPosts();

    expect(posts.map((post) => post.id)).toEqual(["second-post", "first-post"]);
  });

  test("posts live under /writing, except taking-away", () => {
    expect(postPath("streamdown")).toBe("/writing/streamdown");
    expect(postPath("taking-away")).toBe("/taking-away");
  });

  test("formats dates in UTC so frontmatter dates don't shift a day", () => {
    expect(formatPostDate(new Date("2025-01-01"))).toBe("January 1, 2025");
    expect(formatPostDate(new Date("2026-10-07T23:30:00Z"))).toBe(
      "October 7, 2026"
    );
  });
});

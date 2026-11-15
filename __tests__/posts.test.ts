import { describe, expect, test } from "bun:test";

import {
  adjacentPosts,
  formatPostDate,
  getPosts,
  isPostPath,
  postMarkdownPath,
  postPath,
} from "../src/lib/posts";

describe("posts", () => {
  test("lists posts newest first", async () => {
    const posts = await getPosts();

    expect(posts.map((post) => post.id)).toEqual(["second-post", "first-post"]);
  });

  test("posts live under /writing, except taking-away", () => {
    expect(postPath("streamdown")).toBe("/writing/streamdown");
    expect(postPath("taking-away")).toBe("/taking-away");
  });

  test("recognizes every post's path, including those at the root", () => {
    expect(isPostPath(postPath("streamdown"))).toBe(true);
    expect(isPostPath(postPath("taking-away"))).toBe(true);
    expect(isPostPath("/writing")).toBe(false);
    expect(isPostPath("/about")).toBe(false);
  });

  test("each post has a Markdown copy beside it", () => {
    expect(postMarkdownPath("streamdown")).toBe("/writing/streamdown.md");
    expect(postMarkdownPath("taking-away")).toBe("/taking-away.md");
  });

  test("finds the posts published either side of one", () => {
    const posts = [{ id: "newest" }, { id: "middle" }, { id: "oldest" }];

    expect(adjacentPosts(posts, "middle")).toEqual({
      newer: { id: "newest" },
      older: { id: "oldest" },
    });
    expect(adjacentPosts(posts, "newest")).toEqual({
      newer: undefined,
      older: { id: "middle" },
    });
    expect(adjacentPosts(posts, "oldest")).toEqual({
      newer: { id: "middle" },
      older: undefined,
    });
  });

  test("formats dates in UTC so frontmatter dates don't shift a day", () => {
    expect(formatPostDate(new Date("2025-01-01"))).toBe("January 1, 2025");
    expect(formatPostDate(new Date("2026-10-07T23:30:00Z"))).toBe(
      "October 7, 2026"
    );
  });
});

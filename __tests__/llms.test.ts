import { describe, expect, test } from "bun:test";

import { pages } from "../src/lib/pages";
import { projects } from "../src/lib/projects";
import { posts } from "./fixtures/content";

const { GET } = await import("../src/pages/llms.txt");
const call = async () => {
  const response = await GET({} as unknown as Parameters<typeof GET>[0]);
  return response;
};

describe("llms.txt", () => {
  test("is plain text that opens with my name and a summary", async () => {
    const response = await call();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toStartWith("# Hayden Bleasel\n\n> ");
  });

  test("links every page, post and project with absolute URLs", async () => {
    const response = await call();
    const body = await response.text();
    const links = body.match(/^- \[.+\]\(https?:\/\/\S+\): .+$/gmu) ?? [];

    // The RSS feed is the one extra link.
    expect(links).toHaveLength(
      pages.length + posts.length + projects.length + 1
    );
    expect(body).not.toMatch(/\]\(\//u);
  });

  test("points at the Markdown copy of each post", async () => {
    const response = await call();
    const body = await response.text();

    for (const post of posts) {
      expect(body).toContain(
        `/writing/${post.id}.md): ${post.data.description}`
      );
    }
  });
});

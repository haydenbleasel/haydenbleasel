import { describe, expect, test } from "bun:test";

import { posts } from "./fixtures/content";

const { GET, getStaticPaths, postMarkdown } =
  await import("../src/pages/[...slug].md");

type Context = Parameters<typeof GET>[0];
type Post = Parameters<typeof postMarkdown>[0];

const [first, second] = posts as unknown as Post[];

describe("Markdown copies of posts", () => {
  test("builds one beside every post", async () => {
    const paths = await getStaticPaths();

    expect(paths.map((path) => path.params.slug).toSorted()).toEqual([
      "writing/first-post",
      "writing/second-post",
    ]);
  });

  test("is served as Markdown", async () => {
    const response = (await GET({
      props: { post: first },
    } as Context)) as Response;

    expect(response.headers.get("content-type")).toContain("text/markdown");
    expect(await response.text()).toStartWith("# First post\n\n> Older post\n");
  });

  test("names the author, dates and the page it came from", () => {
    const markdown = postMarkdown(first);

    expect(markdown).toContain("By [Hayden Bleasel](");
    expect(markdown).toContain(
      "Published January 1, 2025, updated February 1, 2025."
    );
    expect(markdown).toMatch(/Originally at \S+\/writing\/first-post\n/u);
  });

  test("gives links and images on this site their origin", () => {
    const markdown = postMarkdown(first);

    expect(markdown).toMatch(/\[more\]\(https?:\/\/[^/]+\/writing\)/u);
    expect(markdown).toMatch(
      /!\[a chart\]\(https?:\/\/[^/]+\/images\/a\.webp\)/u
    );
    expect(markdown).toContain("[Elsewhere](https://example.com)");
  });

  test("handles a post with no revision date or body", () => {
    const markdown = postMarkdown(second);

    expect(markdown).toContain("Published January 3, 2025. Originally at");
    expect(markdown).not.toContain("updated");
  });
});

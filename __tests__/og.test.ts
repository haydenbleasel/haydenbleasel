import { describe, expect, test } from "bun:test";

import { pages } from "../src/lib/pages";
import { postPath } from "../src/lib/posts";
import { socialImage } from "../src/lib/social-image";
import { GET, getStaticPaths } from "../src/pages/og/[...slug].png";
import { posts } from "./fixtures/content";

type Context = Parameters<typeof GET>[0];

const paths = async () =>
  (await getStaticPaths({} as Parameters<typeof getStaticPaths>[0])) as {
    params: { slug: string };
    props: { date?: string; description: string; title: string };
  }[];

describe("OG image routes", () => {
  test("builds a card for every page and post", async () => {
    const entries = await paths();

    expect(entries.map((entry) => entry.params.slug)).toEqual([
      ...pages.map((page) => page.slug),
      "writing/second-post",
      "writing/first-post",
    ]);
  });

  test("dates post cards, but not page cards", async () => {
    const entries = await paths();
    const about = entries.find((entry) => entry.params.slug === "about");
    const post = entries.find(
      (entry) => entry.params.slug === "writing/first-post"
    );

    expect(about?.props).toEqual({
      description: pages[1].description,
      title: pages[1].title,
    });
    expect(post?.props).toEqual({
      date: "January 1, 2025",
      description: "Older post",
      title: "First post",
    });
  });

  test("every card a page links to is one the route builds", async () => {
    const entries = await paths();
    const slugs = new Set(entries.map((entry) => entry.params.slug));
    const sitePaths = [
      ...pages.map((page) => page.path),
      ...posts.map((post) => postPath(post.id)),
    ];

    for (const path of sitePaths) {
      const { path: imagePath } = socialImage(path);
      if (imagePath.startsWith("/og/")) {
        const slug = imagePath
          .replace(/^\/og\//u, "")
          .replace(/\.png\?.*$/u, "");
        expect(slugs.has(slug)).toBe(true);
      }
    }
  });

  test("404s for a route without card props", async () => {
    const response = await GET({ props: {} } as unknown as Context);

    expect(response.status).toBe(404);
  });

  test("renders a 1200×630 PNG", async () => {
    const response = await GET({
      props: {
        date: "January 1, 2025",
        description: "Older post",
        title: "First post",
      },
    } as unknown as Context);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const view = new DataView(bytes.buffer);

    expect(response.headers.get("content-type")).toBe("image/png");
    expect(bytes.subarray(0, 8)).toEqual(
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );
    // The IHDR chunk stores width and height straight after the signature.
    expect(view.getUint32(16)).toBe(1200);
    expect(view.getUint32(20)).toBe(630);
  });
});

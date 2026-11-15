import { describe, expect, test } from "bun:test";

import { markdownToHtml } from "satteri";

import { articleImages } from "../src/lib/markdown-images";

const render = (markdown: string) =>
  markdownToHtml(markdown, {
    features: { rawHtml: true },
    hastPlugins: [articleImages],
  }).html;

describe("article images", () => {
  test("reserves space for an image served from public/ and loads it lazily", () => {
    const html = render("![Event flyer](/events/tech-week-flyover.jpg)");

    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toMatch(/width="\d+"/u);
    expect(html).toMatch(/height="\d+"/u);
  });

  test.each([
    ["an image on another site", "![Elsewhere](https://example.com/a.png)"],
    ["an image without a source", "<img alt='Nothing'>"],
  ])("loads %s lazily without measuring it", (_label, markdown) => {
    const html = render(markdown);

    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain("width=");
  });

  test("fails on an image that isn't in public/", () => {
    expect(() => render("![Missing](/images/missing.png)")).toThrow(
      "Can't read the size of the article image /images/missing.png"
    );
  });
});

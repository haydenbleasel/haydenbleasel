import { describe, expect, test } from "bun:test";

import { markdownToHtml } from "satteri";

import { externalArticleLinks } from "../src/lib/markdown-external-links";

const render = (markdown: string) =>
  markdownToHtml(markdown, {
    // Parse inline HTML into elements so the plugin sees its existing rel.
    features: { rawHtml: true },
    hastPlugins: [externalArticleLinks],
  }).html;

describe("external article links", () => {
  test("opens links to other sites in a new tab without an opener or referrer", () => {
    expect(render("[Streamdown](https://streamdown.ai)")).toContain(
      '<a href="https://streamdown.ai" target="_blank" rel="noopener noreferrer">'
    );
    expect(render("[Old site](http://example.com)")).toContain(
      'target="_blank"'
    );
  });

  test("keeps a link's existing rel values without repeating them", () => {
    expect(
      render('<a href="https://example.com" rel="me noopener">Profile</a>')
    ).toContain('rel="me noopener noreferrer"');
  });

  test.each([
    ["a relative link", "[Writing](/writing)"],
    ["a link to this site", "[About](https://haydenbleasel.com/about)"],
    ["a mailto link", "[Email](mailto:hello@example.com)"],
    ["a malformed URL", "[Broken](http://[)"],
    ["an anchor without an href", "<a>Nowhere</a>"],
  ])("leaves %s alone", (_label, markdown) => {
    const html = render(markdown);

    expect(html).toContain("<a");
    expect(html).not.toContain("target=");
    expect(html).not.toContain("noreferrer");
  });
});

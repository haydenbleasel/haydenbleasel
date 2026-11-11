import { describe, expect, test } from "bun:test";

import { pagePath } from "../src/lib/page-path";

describe("pagePath", () => {
  test.each([
    ["/", "/"],
    ["", "/"],
    ["/index.html", "/"],
    ["/about.html", "/about"],
    ["/about/", "/about"],
    ["/writing/streamdown.html", "/writing/streamdown"],
    ["/writing/index.html", "/writing"],
  ])("maps %p to %p", (pathname, expected) => {
    expect(pagePath(pathname)).toBe(expected);
  });
});

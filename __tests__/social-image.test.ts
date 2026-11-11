import { describe, expect, test } from "bun:test";

import {
  portraitImage,
  socialImage,
  socialImagePath,
  socialImageSlug,
} from "../src/lib/social-image";

describe("social images", () => {
  test("the homepage and About page share the square portrait", () => {
    expect(socialImage("/")).toBe(portraitImage);
    expect(socialImage("/about")).toBe(portraitImage);
    expect(portraitImage).toMatchObject({ height: 1024, width: 1024 });
  });

  test("other pages get a versioned 1200×630 card", () => {
    expect(socialImage("/writing/streamdown")).toEqual({
      alt: undefined,
      height: 630,
      path: "/og/writing/streamdown.png?v=4",
      type: "image/png",
      width: 1200,
    });
    expect(socialImagePath("/press")).toBe("/og/press.png?v=4");
  });

  test("slugs drop leading and trailing slashes, and the root is home", () => {
    expect(socialImageSlug("/")).toBe("home");
    expect(socialImageSlug("/writing/streamdown/")).toBe("writing/streamdown");
  });
});

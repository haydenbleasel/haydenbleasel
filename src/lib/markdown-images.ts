import { readFileSync } from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";
import { defineHastPlugin } from "satteri";

// Site-relative images are served from public/, relative to the repo root the
// build runs in.
const PUBLIC_DIRECTORY = "public";

const dimensions = (source: string) => {
  try {
    return imageSize(readFileSync(path.join(PUBLIC_DIRECTORY, source)));
  } catch (error) {
    throw new Error(`Can't read the size of the article image ${source}`, {
      cause: error,
    });
  }
};

// Article images load as they near the viewport, and reserve their space so
// the text below doesn't jump when they arrive. A missing or unreadable file
// fails the build instead of shipping a broken image.
export const articleImages = defineHastPlugin({
  element: {
    filter: ["img"],
    visit(node, context) {
      const { src } = node.properties;
      context.setProperty(node, "loading", "lazy");
      context.setProperty(node, "decoding", "async");
      if (typeof src !== "string" || !src.startsWith("/")) {
        return;
      }

      const { height, width } = dimensions(src);
      context.setProperty(node, "width", width);
      context.setProperty(node, "height", height);
    },
  },
  name: "article-images",
});

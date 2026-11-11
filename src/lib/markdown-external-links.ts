import { defineHastPlugin } from "satteri";

import { identity } from "./person";

const siteHostname = new URL(identity).hostname;

const isExternal = (href: string) => {
  try {
    const link = new URL(href, identity);
    return (
      (link.protocol === "https:" || link.protocol === "http:") &&
      link.hostname !== siteHostname
    );
  } catch {
    return false;
  }
};

// Set attributes in rendered Markdown so article links work without JavaScript.
export const externalArticleLinks = defineHastPlugin({
  element: {
    filter: ["a"],
    visit(node, context) {
      const { properties } = node;
      if (typeof properties.href !== "string" || !isExternal(properties.href)) {
        return;
      }

      const rel = Array.isArray(properties.rel)
        ? properties.rel
        : String(properties.rel ?? "").split(/\s+/u);
      context.setProperty(node, "target", "_blank");
      context.setProperty(
        node,
        "rel",
        [...new Set([...rel, "noopener", "noreferrer"])].filter(Boolean)
      );
    },
  },
  name: "article-external-links",
});

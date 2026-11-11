import { describe, expect, test } from "bun:test";

import { socialCard } from "../src/lib/social-card";

interface CardNode {
  children?: CardNode[];
  src?: string;
  style?: { fontSize?: number };
  text?: string;
  type: string;
}

const flatten = (node: CardNode): CardNode[] => [
  node,
  ...(node.children ?? []).flatMap(flatten),
];

const card = (page: Parameters<typeof socialCard>[0]) =>
  flatten(socialCard(page, "data:image/jpeg;base64,portrait") as CardNode);

const texts = (nodes: CardNode[]) =>
  nodes.filter((node) => node.type === "text").map((node) => node.text);

const titleSize = (title: string) =>
  card({ description: "Description", title }).find(
    (node) => node.text === title
  )?.style?.fontSize;

describe("social card", () => {
  test("shows the name, title, description and domain", () => {
    expect(texts(card({ description: "Description", title: "Title" }))).toEqual(
      ["Hayden Bleasel", "Title", "Description", "haydenbleasel.com"]
    );
  });

  test("adds the date when there is one", () => {
    expect(
      texts(
        card({
          date: "January 1, 2025",
          description: "Description",
          title: "Title",
        })
      )
    ).toContain("January 1, 2025");
  });

  test("uses the given portrait", () => {
    const image = card({ description: "Description", title: "Title" }).find(
      (node) => node.type === "image"
    );

    expect(image?.src).toBe("data:image/jpeg;base64,portrait");
  });

  test("shrinks long titles so they fit", () => {
    expect(titleSize("x".repeat(32))).toBe(56);
    expect(titleSize("x".repeat(33))).toBe(52);
    expect(titleSize("x".repeat(55))).toBe(52);
    expect(titleSize("x".repeat(56))).toBe(48);
  });
});

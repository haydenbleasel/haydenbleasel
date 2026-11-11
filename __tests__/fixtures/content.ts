import { mock } from "bun:test";

// Astro supplies this virtual module during builds and development. Keep the
// fixtures unsorted so route tests exercise the collection's date ordering.
export const posts = [
  {
    data: {
      date: new Date("2025-01-01"),
      description: "Older post",
      title: "First post",
      updated: new Date("2025-02-01"),
    },
    id: "first-post",
  },
  {
    data: {
      date: new Date("2025-01-03"),
      description: "A description with <markup> & punctuation",
      title: "Second post & more",
    },
    id: "second-post",
  },
];

mock.module("astro:content", () => ({
  getCollection: () => Promise.resolve(posts),
}));

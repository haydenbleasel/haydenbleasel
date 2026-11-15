// What `getCollection("posts")` returns in tests (see support/preload.ts). Keep
// the fixtures unsorted so route tests exercise the collection's date ordering.
export const posts = [
  {
    data: {
      date: new Date("2025-01-01"),
      description: "Older post",
      title: "First post",
      updated: new Date("2025-02-01"),
    },
    id: "first-post",
    // What the Markdown loader stores for a post. The second post has none, as
    // an entry without a body would.
    rendered: {
      html: '<p>See <a href="/writing">more</a>.</p><img src="/images/a.webp" alt=""><p>A stray ]]> marker and <a href="https://example.com">a link</a>.</p>',
    },
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

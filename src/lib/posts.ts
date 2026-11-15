import { getCollection } from "astro:content";

export const getPosts = async () => {
  const posts = await getCollection("posts");
  return posts.toSorted(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
};

export const postPath = (id: string) => `/writing/${id}`;

// Whether a page path is a post, rather than the /writing index.
export const isPostPath = (pathname: string) =>
  pathname.startsWith("/writing/");

// The Markdown copy of a post, for agents (src/pages/[...slug].md.ts).
export const postMarkdownPath = (id: string) => `${postPath(id)}.md`;

// The posts published either side of one, in a list sorted newest first.
export const adjacentPosts = <Post extends { id: string }>(
  posts: Post[],
  id: string
): { newer?: Post; older?: Post } => {
  const index = posts.findIndex((post) => post.id === id);
  return { newer: posts[index - 1], older: posts[index + 1] };
};

export const formatPostDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);

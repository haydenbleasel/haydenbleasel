import { getCollection } from "astro:content";

export const getPosts = async () => {
  const posts = await getCollection("posts");
  return posts.toSorted(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
};

// Posts served from the site root instead of under /writing.
const rootPosts = new Set(["taking-away"]);

export const postPath = (id: string) =>
  rootPosts.has(id) ? `/${id}` : `/writing/${id}`;

// Whether a page path is a post, wherever postPath serves it.
export const isPostPath = (pathname: string) =>
  pathname.startsWith("/writing/") || rootPosts.has(pathname.slice(1));

export const formatPostDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);

import { getCollection } from "astro:content";

export const getPosts = async () => {
  const posts = await getCollection("posts");
  return posts.toSorted(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
};

export const postPath = (id: string) =>
  id === "taking-away" ? "/taking-away" : `/writing/${id}`;

export const formatPostDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);

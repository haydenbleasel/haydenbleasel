import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";

import { person } from "@/lib/person";
import { formatPostDate, getPosts, postPath } from "@/lib/posts";
import { url } from "@/lib/url";

export const prerender = true;

// Every post is also published as Markdown at <post URL>.md: the same words
// without the page around them, which is what agents and answer engines read
// most reliably. The HTML page links here with rel="alternate", and llms.txt
// lists these URLs.
export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({
    params: { slug: postPath(post.id).slice(1) },
    props: { post },
  }));
}) satisfies GetStaticPaths;

interface Props {
  post: CollectionEntry<"posts">;
}

export const postMarkdown = ({ body = "", data, id }: Props["post"]) => {
  const dates = [
    `Published ${formatPostDate(data.date)}`,
    ...(data.updated ? [`updated ${formatPostDate(data.updated)}`] : []),
  ].join(", ");

  return `# ${data.title}

> ${data.description}

By [${person.name}](${url}). ${dates}. Originally at ${url}${postPath(id)}

${body
  // Links and images that point at this site need its origin to resolve.
  .replaceAll(/\]\(\/(?!\/)/gu, `](${url}/`)
  .trim()}
`;
};

export const GET: APIRoute<Props> = ({ props }) =>
  new Response(postMarkdown(props.post), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });

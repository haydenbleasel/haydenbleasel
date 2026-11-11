import { readFile } from "node:fs/promises";

import type { APIRoute, GetStaticPaths } from "astro";
import { ImageResponse } from "takumi-js/response";

import { pages } from "@/lib/pages";
import { formatPostDate, getPosts, postPath } from "@/lib/posts";
import type { SocialCard } from "@/lib/social-card";
import { socialCard } from "@/lib/social-card";
import { socialImageSlug } from "@/lib/social-image";

export const prerender = true;

// Build every card from the same metadata as its page. New posts are picked
// up automatically, without loading fonts or rendering images at request time.
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();

  return [
    ...pages.map((page) => ({
      params: { slug: socialImageSlug(page.path) },
      props: { description: page.description, title: page.title },
    })),
    ...posts.map((post) => ({
      params: { slug: socialImageSlug(postPath(post.id)) },
      props: {
        date: formatPostDate(post.data.date),
        description: post.data.description,
        title: post.data.title,
      },
    })),
  ];
};

export const GET: APIRoute<SocialCard> = async ({ props }) => {
  // An unknown image can fall through to the worker during development.
  // Avoid reading build-only font files for routes without static props.
  if (!props.title || !props.description) {
    return new Response("Not found", { status: 404 });
  }

  const [buch, kraftig, portrait] = await Promise.all([
    readFile("public/fonts/soehne-buch.woff2"),
    readFile("public/fonts/soehne-kraftig.woff2"),
    readFile("src/assets/og-portrait.jpg"),
  ]);

  return new ImageResponse(
    socialCard(props, `data:image/jpeg;base64,${portrait.toString("base64")}`),
    {
      fonts: [
        { data: buch, name: "Soehne", weight: 400 },
        { data: kraftig, name: "Soehne", weight: 500 },
      ],
      height: 630,
      width: 1200,
    }
  );
};

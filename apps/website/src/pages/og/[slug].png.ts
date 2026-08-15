import { readFile } from "node:fs/promises";

import type { APIRoute, GetStaticPaths } from "astro";
import { container, image, text } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";

import type { PageMeta } from "@/lib/pages";
import { pages } from "@/lib/pages";

export const prerender = true;

// Spread: GetStaticPaths props need an implicit index signature, which the
// PageMeta interface lacks but the anonymous spread type carries.
export const getStaticPaths: GetStaticPaths = () =>
  pages.map((page) => ({ params: { slug: page.slug }, props: { ...page } }));

// Paths are cwd-relative because this module is bundled before it runs:
// dev, build and bun test all execute with apps/website as the cwd.
const [buch, kraftig, photo] = await Promise.all([
  readFile("public/fonts/soehne-buch.woff2"),
  readFile("public/fonts/soehne-kraftig.woff2"),
  readFile("public/photo-1x1.jpg"),
]);

const zinc = "#71717a";

const card = (page: PageMeta) =>
  container({
    children: [
      image({
        height: 96,
        src: new Uint8Array(photo),
        style: { borderRadius: 48 },
        width: 96,
      }),
      container({
        children: [
          text(page.title, {
            fontSize: 76,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }),
          text(page.description, {
            color: zinc,
            fontSize: 30,
            lineHeight: 1.45,
            maxWidth: 900,
            textWrap: "balance",
          }),
        ],
        style: { display: "flex", flexDirection: "column", gap: 20 },
      }),
      text("haydenbleasel.com", { color: zinc, fontSize: 24 }),
    ],
    style: {
      backgroundColor: "#ffffff",
      color: "#000000",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Soehne",
      height: "100%",
      justifyContent: "space-between",
      padding: 80,
      width: "100%",
    },
  });

export const GET: APIRoute<PageMeta> = ({ props }) =>
  new ImageResponse(card(props), {
    fonts: [
      { data: buch, name: "Soehne", weight: 400 },
      { data: kraftig, name: "Soehne", weight: 500 },
    ],
    height: 630,
    width: 1200,
  });

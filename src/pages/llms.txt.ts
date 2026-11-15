import type { APIRoute } from "astro";

import { homeDescription, pages } from "@/lib/pages";
import { person } from "@/lib/person";
import { getPosts, postMarkdownPath } from "@/lib/posts";
import { projects } from "@/lib/projects";
import { url } from "@/lib/url";

export const prerender = true;

const link = (title: string, href: string, description: string) =>
  `- [${title}](${new URL(href, url).href}): ${description}`;

// An index of the site for language models (https://llmstxt.org): who I am,
// the main pages, every post as Markdown, and my projects.
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const body = `# ${person.name}

> ${homeDescription}

${person.description}

## Pages

${pages.map((page) => link(page.title, page.path, page.description)).join("\n")}

## Writing

${posts
  .map((post) =>
    link(post.data.title, postMarkdownPath(post.id), post.data.description)
  )
  .join("\n")}

## Projects

${projects
  .map((project) =>
    link(
      project.name,
      project.url,
      `${project.description} (${project.status})`
    )
  )
  .join("\n")}

## Optional

${link("RSS feed", "/rss.xml", "Every post in full, plus writing published elsewhere.")}
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};

import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "*.md" }),
  schema: z.object({
    date: z.coerce.date(),
    description: z.string(),
    title: z.string(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { posts };

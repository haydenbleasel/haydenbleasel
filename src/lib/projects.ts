import { identity, personRef } from "./person";

export interface Project {
  description: string;
  footnote?: number;
  name: string;
  status: "Active" | "Acquired" | "Merged" | "Archived";
  url: string;
}

export const projects: Project[] = [
  {
    description: "The linter and formatter for agentic development.",
    name: "Ultracite",
    status: "Active",
    url: "https://www.ultracite.ai",
  },
  {
    description: "A unified storage SDK for object and blob backends.",
    name: "Files SDK",
    status: "Active",
    url: "https://files-sdk.dev",
  },
  {
    description: "Open-source docs framework for humans and agents",
    name: "Blume",
    status: "Active",
    url: "https://useblume.dev/",
  },
  {
    description: "Email your mailing list from your agent.",
    name: "Sendoff",
    status: "Active",
    url: "https://sendoff.dev",
  },
  {
    description: "A UI library for building web applications.",
    name: "Kibo UI",
    status: "Acquired",
    url: "https://www.shadcnblocks.com/blog/announcing-kibo-ui-acquisition/",
  },
  {
    description: "Learn, improve and generate code with AI.",
    footnote: 1,
    name: "Refraction",
    status: "Acquired",
    url: "https://x.com/haydenbleasel/status/1678770475647012864",
  },
  {
    description: "Production-grade Turborepo template.",
    name: "next-forge",
    status: "Acquired",
    url: "https://x.com/haydenbleasel/status/1929625673586598148",
  },
  {
    description: "AI toolkit for transcribing and synthesizing speech.",
    name: "Orate",
    status: "Merged",
    url: "https://x.com/haydenbleasel/status/1931033287851675688",
  },
  {
    description: "The open source product management platform.",
    name: "Eververse",
    status: "Archived",
    url: "https://github.com/haydenbleasel/eververse",
  },
  {
    description: "Save up to 50% on LLM costs.",
    name: "Batchwork",
    status: "Archived",
    url: "https://github.com/haydenbleasel/batchwork",
  },
  {
    description: "Simple, reliable dedicated game servers.",
    name: "Ghost",
    status: "Archived",
    url: "https://github.com/haydenbleasel/ghost",
  },
  {
    description: "Track and offset your carbon footprint.",
    name: "Neutral",
    status: "Archived",
    url: "/writing/neutral",
  },
];

// Open source I created while at Vercel, as listed under Work on the About
// page. Keep the two in step.
export const vercelProjects = [
  { name: "Streamdown", url: "https://streamdown.ai/" },
  { name: "AI Elements", url: "https://ui.shadcn.com/docs/ai-elements" },
  { name: "Remend", url: "https://www.npmjs.com/package/remend" },
  { name: "Tersa", url: "https://github.com/vercel-labs/tersa" },
  { name: "OpenReview", url: "https://github.com/vercel-labs/openreview" },
  { name: "Vectr", url: "https://github.com/vercel-labs/vectr" },
  { name: "npm.bet", url: "https://www.npm.bet/" },
];

// Where a project's link leads decides which property carries it: a
// repository, the project's own site (only active projects still have one),
// or a page about it, such as an acquisition announcement.
const projectLink = (project: Pick<Project, "url"> & { status?: string }) => {
  const url = new URL(project.url, identity).href;
  if (url.startsWith("https://github.com/")) {
    return { codeRepository: url };
  }
  if (!project.status || project.status === "Active") {
    return { url };
  }
  return { subjectOf: { "@type": "WebPage", url } };
};

/**
 * A structured-data node naming me as the creator of a project, so "who made
 * Ultracite" has a machine-readable answer.
 */
export const projectSchema = (
  project: Pick<Project, "name" | "url"> & Partial<Project>
) => ({
  "@type": "SoftwareSourceCode",
  creator: personRef,
  ...(project.description && { description: project.description }),
  name: project.name,
  ...projectLink(project),
});

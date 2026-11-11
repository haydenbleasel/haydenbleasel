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

export interface WritingItem {
  // Additional credited authors beyond me, for co-authored works.
  coAuthors?: { name: string; url: string }[];
  // The publication date (YYYY-MM-DD) shown on the article. Give it for every
  // new entry: the RSS feed dates an entry without one to January 1 of its
  // year. It's only missing where the page shows no date.
  date?: string;
  description: string;
  publisher: string;
  // Schema.org type for the JSON-LD item; defaults to Article.
  schemaType?: "CreativeWork";
  title: string;
  url: string;
  year: number;
}

export const writing: WritingItem[] = [
  {
    date: "2026-03-16",
    description: "Inline math, streaming animations and improved code blocks.",
    publisher: "Vercel",
    title: "Streamdown 2.5 is now available",
    url: "https://vercel.com/changelog/streamdown-2-5",
    year: 2026,
  },
  {
    date: "2026-03-13",
    description: "Bun by default, optional integrations and an agent skill.",
    publisher: "Vercel",
    title: "next-forge 6 is now available",
    url: "https://vercel.com/changelog/next-forge-6",
    year: 2026,
  },
  {
    date: "2026-03-12",
    description: "JSX previews, screenshots and downloadable conversations.",
    publisher: "Vercel",
    title: "AI Elements 1.9 is now available",
    url: "https://vercel.com/changelog/ai-elements-1-9",
    year: 2026,
  },
  {
    date: "2026-03-11",
    description: "Manage feature flags from the CLI and with AI agents.",
    publisher: "Vercel",
    title: "Vercel Flags are now optimized for agents",
    url: "https://vercel.com/changelog/vercel-flags-are-now-optimized-for-agents",
    year: 2026,
  },
  {
    date: "2026-03-11",
    description: "Messages, reactions and read receipts for WhatsApp bots.",
    publisher: "Vercel",
    title: "Chat SDK adds WhatsApp adapter support",
    url: "https://vercel.com/changelog/chat-sdk-adds-whatsapp-adapter-support",
    year: 2026,
  },
  {
    date: "2026-03-10",
    description: "Store bot state in PostgreSQL without Redis.",
    publisher: "Vercel",
    title: "Chat SDK adds PostgreSQL state adapter",
    url: "https://vercel.com/changelog/chat-sdk-adds-postgresql-state-adapter",
    year: 2026,
  },
  {
    date: "2026-03-10",
    description: "Find official and community adapters in one place.",
    publisher: "Vercel",
    title: "Chat SDK now has an adapter directory",
    url: "https://vercel.com/changelog/chat-sdk-adapter-directory",
    year: 2026,
  },
  {
    date: "2026-03-06",
    description: "Render tables and stream Markdown across chat platforms.",
    publisher: "Vercel",
    title: "Chat SDK adds table rendering and streaming markdown",
    url: "https://vercel.com/changelog/chat-sdk-adds-table-rendering-and-streaming-markdown",
    year: 2026,
  },
  {
    date: "2026-03-05",
    description: "More control over rendering, languages and accessibility.",
    publisher: "Vercel",
    title:
      "Streamdown 2.4: More customization, accessibility and custom rendering",
    url: "https://vercel.com/changelog/streamdown-2-4",
    year: 2026,
  },
  {
    date: "2026-02-27",
    description: "Mentions, reactions and typing indicators for Telegram bots.",
    publisher: "Vercel",
    title: "Chat SDK adds Telegram adapter support",
    url: "https://vercel.com/changelog/chat-sdk-adds-telegram-adapter-support",
    year: 2026,
  },
  {
    date: "2026-02-23",
    description: "Write bot logic once and deploy across chat platforms.",
    publisher: "Vercel",
    title: "Introducing npm i chat – One codebase, every chat platform",
    url: "https://vercel.com/changelog/chat-sdk",
    year: 2026,
  },
  {
    date: "2026-02-19",
    description: "A refreshed design, playground and custom rendering hooks.",
    publisher: "Vercel",
    title: "Streamdown 2.3 — Refreshed design and interactive playground",
    url: "https://vercel.com/changelog/streamdown-2-3",
    year: 2026,
  },
  {
    date: "2026-01-21",
    description: "Composable components for coding apps and AI agents.",
    publisher: "Vercel",
    title: "AI Code Elements",
    url: "https://vercel.com/changelog/ai-code-elements",
    year: 2026,
  },
  {
    date: "2026-01-14",
    description: "Components for voice agents, transcription and speech apps.",
    publisher: "Vercel",
    title: "AI Voice Elements",
    url: "https://vercel.com/changelog/ai-voice-elements",
    year: 2026,
  },
  {
    date: "2026-01-12",
    description:
      "A smaller plugin-based core with configurable Markdown repair.",
    publisher: "Vercel",
    title: "Streamdown v2: Smaller bundle size and new Remend options",
    url: "https://vercel.com/changelog/streamdown-v2",
    year: 2026,
  },
  {
    description: "Build production-ready monorepos with Turborepo.",
    publisher: "Vercel Academy",
    title: "Production Monorepos with Turborepo",
    url: "https://vercel.com/academy/production-monorepos",
    year: 2025,
  },
  {
    description: "Build React interfaces with shadcn/ui, Radix and Tailwind.",
    publisher: "Vercel Academy",
    title: "React UI with shadcn/ui + Radix + Tailwind",
    url: "https://vercel.com/academy/shadcn-ui",
    year: 2025,
  },
  {
    date: "2025-11-24",
    description: "Build visual workflows with drag-and-drop editing and AI.",
    publisher: "Vercel",
    title: "Workflow Builder: Build your own workflow automation platform",
    url: "https://vercel.com/blog/workflow-builder-build-your-own-workflow-automation-platform",
    year: 2025,
  },
  {
    date: "2025-12-05",
    description: "Prebuilt components and actions for multi-tenant platforms.",
    publisher: "Vercel",
    title: "Introducing Platform Elements",
    url: "https://vercel.com/changelog/introducing-platform-elements",
    year: 2025,
  },
  {
    date: "2025-12-05",
    description: "Deploy platforms with multi-tenant and multi-project modes.",
    publisher: "Vercel",
    title: "Introducing Vercel for Platforms",
    url: "https://vercel.com/changelog/introducing-vercel-for-platforms",
    year: 2025,
  },
  {
    date: "2025-12-03",
    description: "Repair incomplete Markdown as AI responses stream.",
    publisher: "Vercel",
    title:
      "New npm package for automatic recovery of broken streaming markdown",
    url: "https://vercel.com/changelog/new-npm-package-for-automatic-recovery-of-broken-streaming-markdown",
    year: 2025,
  },
  {
    date: "2025-11-24",
    description: "A leaner Markdown renderer with faster code highlighting.",
    publisher: "Vercel",
    title: "Streamdown 1.6 is now available to run faster and ship less code",
    url: "https://vercel.com/changelog/streamdown-1-6-is-now-available-to-run-faster-and-ship-less-code",
    year: 2025,
  },
  {
    date: "2025-09-08",
    description: "Animated text streaming and better custom HTML support.",
    publisher: "Vercel",
    title:
      "Streamdown 2.2 - animated streaming and better support for custom HTML",
    url: "https://vercel.com/changelog/streamdown-2-2",
    year: 2025,
  },
  {
    date: "2025-08-21",
    description: "An open source Markdown renderer built for AI streaming.",
    publisher: "Vercel",
    title: "Introducing Streamdown: Open source Markdown for AI streaming",
    url: "https://vercel.com/changelog/introducing-streamdown",
    year: 2025,
  },
  {
    date: "2025-08-06",
    description: "Composable React components for AI interfaces.",
    publisher: "Vercel",
    title: "Introducing AI Elements: Prebuilt, composable AI SDK components",
    url: "https://vercel.com/changelog/introducing-ai-elements",
    year: 2025,
  },
  {
    coAuthors: [{ name: "shadcn", url: "https://shadcn.com" }],
    description:
      "A guide to building component libraries, co-authored with shadcn.",
    publisher: "Vercel",
    // An open specification, not a conventional article.
    schemaType: "CreativeWork",
    title: "components.build",
    url: "https://www.components.build/",
    year: 2025,
  },
  {
    description: "A tour of the redesigned Corellium platform.",
    publisher: "Corellium",
    title: "A Brief Look at the New Corellium",
    url: "https://www.corellium.com/blog/a-brief-look-at-the-new-corellium",
    year: 2023,
  },
  {
    date: "2022-08-10",
    description: "The story behind ESLint’s brand and website redesign.",
    publisher: "ESLint",
    title: "Redesigning ESLint",
    url: "https://eslint.org/blog/2022/08/redesigning-eslint/",
    year: 2022,
  },
];

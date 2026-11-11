export interface PressItem {
  // Whether the article itself names me. Articles that only cover a company
  // milestone must not claim Article.about person in the JSON-LD.
  mentionsMe: boolean;
  note: string;
  outlet: string;
  title: string;
  // JSON-LD item type; defaults to "article" when omitted.
  type?: "article" | "video";
  url: string;
  year: number;
}

export const press: PressItem[] = [
  {
    mentionsMe: true,
    note: "My article on Remend and self-healing Markdown, featured in issue 28.",
    outlet: "Token by Token",
    title: "Are you tracking tokens the wrong way? - #28 token by token",
    url: "https://preview.mailerlite.io/preview/2096144/emails/201966935637755370",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "Russian-language coverage of Blume’s documentation workflow for people and AI agents.",
    outlet: "InsidePC",
    title:
      "Blume: сайт документации из папки Markdown, который читают люди и ИИ-агенты",
    url: "https://insidepc.tech/ai/ai-reviews/ai-code/blume-sayt-dokumentatsii-repozitoriya",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "Blume’s open-source documentation workflow for people and AI agents.",
    outlet: "Dr. Web",
    title:
      "Blume: Das quelloffene Dokumentations-Framework für Menschen und KI-Agenten",
    url: "https://www.drweb.de/blume-docs-framework-mintlify-alternative/",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "Blume’s Markdown workflow, MCP integration and AI agent support.",
    outlet: "heise online",
    title: "Blume creates complete web documentation from a Markdown file",
    url: "https://www.heise.de/en/news/Blume-creates-complete-web-documentation-from-a-Markdown-file-11443923.html",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "Blume’s approach to zero-config, AI-ready documentation.",
    outlet: "InfoQ",
    title:
      "Blume: Zero-Config Docs Framework That Turns a Markdown Folder into an AI-Ready Website",
    url: "https://www.infoq.com/news/2026/09/blume-docs-ai/",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "Migrating the Logixlysia docs from Fumadocs to Blume.",
    outlet: "PunGrumpy",
    title: "Docs are content again: moving Logixlysia from Fumadocs to Blume",
    url: "https://www.pungrumpy.com/blog/moving-logixlysia-from-fumadocs-to-blume",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "Credits my work with shadcn on components.build.",
    outlet: "AI-Driven Lab (note.com)",
    title:
      "shadcn's popular extension library 'cult-ui' has quietly shifted its focus to 'AI Agents'",
    url: "https://note.com/ai_driven/n/n8166a3e69b6e?hl=en",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "A look at Blume’s launch and AI documentation features.",
    outlet: "MarkTechPost",
    title:
      "Meet Blume: An Open-Source, Zero-Config Documentation Framework That Ships AI-Ready Docs From a Markdown Folder",
    url: "https://www.marktechpost.com/2026/07/14/meet-blume-an-open-source-zero-config-documentation-framework-that-ships-ai-ready-docs-from-a-markdown-folder/",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "Japanese coverage of Blume’s launch and documentation features.",
    outlet: "gihyo.jp",
    title:
      "Markdownからドキュメントサイトを構築、Astro/ViteベースのOSS「Blume」v1が公開",
    url: "https://gihyo.jp/article/2026/07/blume",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "Ghost featured in an open-source roundup, credited to @haydenbleasel.",
    outlet: "fmerian (DEV Community)",
    title: "5 awesome OSS products launched on Product Hunt in 2026",
    url: "https://dev.to/fmerian/5-awesome-oss-products-launched-on-product-hunt-in-2026-2p9",
    year: 2026,
  },
  {
    mentionsMe: true,
    note: "A retrospective on Ultracite’s two Product Hunt launches.",
    outlet: "fmerian (DEV Community)",
    title: "Launched Ultracite on Product Hunt twice. Here's what I learned.",
    url: "https://dev.to/fmerian/launched-ultracite-on-product-hunt-twice-heres-what-i-learned-e10",
    year: 2025,
  },
  {
    mentionsMe: false,
    note: "Cellebrite acquires Corellium, where I was CPO.",
    outlet: "TechCrunch",
    title:
      "Phone unlocking firm Cellebrite to acquire mobile testing startup Corellium for $170M",
    url: "https://techcrunch.com/2025/06/05/phone-unlocking-firm-cellebrite-to-acquire-mobile-testing-startup-corellium-for-170m/",
    year: 2025,
  },
  {
    mentionsMe: true,
    note: "shadcnblocks acquires Kibo UI, the component library I created.",
    outlet: "shadcnblocks",
    title: "Announcing the Kibo UI acquisition",
    url: "https://www.shadcnblocks.com/blog/announcing-kibo-ui-acquisition/",
    year: 2025,
  },
  {
    mentionsMe: true,
    note: "Kibo UI among Untitled UI’s recommended React libraries.",
    outlet: "Untitled UI",
    title:
      "15 Best React UI Component Libraries in 2026 (+ Alternatives to MUI & Shadcn)",
    url: "https://www.untitledui.com/blog/react-component-libraries",
    year: 2025,
  },
  {
    mentionsMe: true,
    note: "A look at enterprise development with my next-forge template.",
    outlet: "Josh tried coding",
    title: "What Large-Scale Software Looks Like",
    type: "video",
    url: "https://www.youtube.com/watch?v=aHZz_6NhQkQ",
    year: 2024,
  },
  {
    mentionsMe: false,
    note: "eToro acquires Spaceship, where I led product and design.",
    outlet: "Australian Financial Review",
    title: "Cannon-Brookes-backed Spaceship acquired in $80m deal",
    url: "https://www.afr.com/technology/cannon-brookes-backed-spaceship-acquired-in-80m-deal-20240926-p5kdo9",
    year: 2024,
  },
  {
    mentionsMe: true,
    note: "The design process behind my work on the Node.js website.",
    outlet: "Node.js",
    title: "Diving into the Node.js Website Redesign",
    url: "https://nodejs.org/en/blog/announcements/diving-into-the-nodejs-website-redesign",
    year: 2024,
  },
  {
    mentionsMe: true,
    note: "Raw Studio acquires Jellypepper, the agency I founded.",
    outlet: "Raw Studio",
    title:
      "Raw Studio acquires Jellypepper to expand its reach to the startup ecosystem",
    url: "https://raw.studio/blog/raw-studio-acquires-jellypepper-to-expand-its-reach-to-the-startup-ecosystem/",
    year: 2023,
  },
  {
    mentionsMe: true,
    note: "Featured as a designer to follow for UI design.",
    outlet: "Untitled UI",
    title: "How to Improve Your UI Design Skills",
    url: "https://www.untitledui.com/blog/ui-design-skills#hayden-bleasel",
    year: 2023,
  },
  {
    mentionsMe: true,
    note: "My work as Senior Experience Designer on Timberland’s TimbsTrails.",
    outlet: "Campaign Brief",
    title:
      "Timberland launches new TimbsTrails immersive digital storytelling experience via R/GA Australia",
    url: "https://campaignbrief.com/timberland-launches-new-timbstrails-immersive-digital-storytelling-experience-via-r-ga-australia/",
    year: 2022,
  },
  {
    mentionsMe: true,
    note: "Reflections on my product design internship at Palantir.",
    outlet: "Figma Design (Medium)",
    title: "10 UI/UX Design Internships Figma Users Swear By",
    url: "https://medium.com/figma-design/10-ui-ux-design-internships-figma-users-swear-by-fd0fa73dc621",
    year: 2017,
  },
  {
    mentionsMe: false,
    note: "Lessons from ten designers and producers in 2017.",
    outlet: "8px Magazine (Medium)",
    title: "2017 roundup: What did the industry teach these 10 designers?",
    url: "https://medium.com/8px-magazine/2017-roundup-what-did-the-industry-teach-these-10-designers-496758496134",
    year: 2017,
  },
  {
    mentionsMe: true,
    note: "A profile of Presumi, the resume analytics tool I created.",
    outlet: "Startup Daily",
    title:
      "Sydney startup Presumi helps job seekers see how employers interact with their resume",
    url: "https://www.startupdaily.net/advice/sydney-startup-presumi-helps-job-seekers-see-employers-interact-resume/",
    year: 2016,
  },
  {
    mentionsMe: true,
    note: "A profile of my early startup work.",
    outlet: "UTS Newsroom",
    title: "Hard Slog and Serendipity on the Path to Overnight Success",
    url: "https://www.uts.edu.au/news/2016/06/hard-slog-and-serendipity-path-overnight-success",
    year: 2016,
  },
  {
    mentionsMe: true,
    note: "A profile in ICC Sydney’s magazine.",
    outlet: "Sydney Views (ICC Sydney)",
    title: "Sydney Views — Edition 3",
    url: "https://iccsydney.com.au/wp-content/uploads/2023/05/160909_Sydney-Views_Edition-3_FINAL.pdf",
    year: 2016,
  },
];

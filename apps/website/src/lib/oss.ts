import { GITHUB_TOKEN } from "astro:env/server";

import { toSparklinePoints } from "@/lib/format";

interface ProjectSpec {
  acquired?: boolean;
  name: string;
  // Omitted for projects without a published npm package.
  npm?: string;
  repo: string;
  // Built for Vercel rather than a personal project.
  vercel?: boolean;
}

// Curated open source projects, in display order.
const projectSpecs: ProjectSpec[] = [
  { name: "ultracite", npm: "ultracite", repo: "haydenbleasel/ultracite" },
  { name: "files-sdk", npm: "files-sdk", repo: "haydenbleasel/files-sdk" },
  { name: "blume", npm: "blume", repo: "haydenbleasel/blume" },
  {
    acquired: true,
    name: "next-forge",
    npm: "next-forge",
    repo: "vercel/next-forge",
  },
  {
    acquired: true,
    name: "kibo-ui",
    npm: "kibo-ui",
    repo: "shadcnblocks/kibo",
  },
  {
    name: "streamdown",
    npm: "streamdown",
    repo: "vercel/streamdown",
    vercel: true,
  },
  {
    name: "ai-elements",
    npm: "ai-elements",
    repo: "vercel/ai-elements",
    vercel: true,
  },
  { name: "chat", npm: "chat", repo: "vercel/chat", vercel: true },
  { name: "tersa", repo: "vercel-labs/tersa", vercel: true },
  { name: "openreview", repo: "vercel-labs/openreview", vercel: true },
  { name: "components.build", repo: "vercel/components.build", vercel: true },
  { name: "vectr", repo: "vercel-labs/vectr", vercel: true },
  {
    name: "workflow-builder-template",
    repo: "vercel-labs/workflow-builder-template",
    vercel: true,
  },
];

export interface OssProject {
  acquired: boolean;
  // Null when the project has no npm package to report downloads for.
  downloads: number | null;
  name: string;
  points: number[];
  stars: number;
  url: string;
  vercel: boolean;
}

interface NpmDownloadRange {
  downloads: { day: string; downloads: number }[];
}

const getStars = async (repo: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        accept: "application/vnd.github+json",
        ...(GITHUB_TOKEN ? { authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      return 0;
    }

    const data = (await response.json()) as { stargazers_count?: number };

    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
};

const getDownloads = async (
  npm: string
): Promise<{ downloads: number; points: number[] }> => {
  try {
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/last-year/${encodeURIComponent(npm)}`
    );

    if (!response.ok) {
      return { downloads: 0, points: [] };
    }

    const data = (await response.json()) as NpmDownloadRange;
    const daily = data.downloads.map((day) => day.downloads);
    const total = daily.reduce((sum, value) => sum + value, 0);

    return { downloads: total, points: toSparklinePoints(daily) };
  } catch {
    return { downloads: 0, points: [] };
  }
};

export const getOssProjects = (): Promise<OssProject[]> =>
  Promise.all(
    projectSpecs.map(async (spec) => {
      const [stars, { downloads, points }] = await Promise.all([
        getStars(spec.repo),
        spec.npm
          ? getDownloads(spec.npm)
          : Promise.resolve({ downloads: null, points: [] }),
      ]);

      return {
        acquired: spec.acquired ?? false,
        downloads,
        name: spec.name,
        points,
        stars,
        url: `https://github.com/${spec.repo}`,
        vercel: spec.vercel ?? false,
      } satisfies OssProject;
    })
  );

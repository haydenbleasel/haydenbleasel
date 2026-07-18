import { GITHUB_TOKEN } from "astro:env/server";

import { toSparklinePoints } from "@/lib/format";

interface ProjectSpec {
  acquired?: boolean;
  name: string;
  npm: string;
  repo: string;
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
];

export interface OssProject {
  acquired: boolean;
  downloads: number;
  name: string;
  points: number[];
  stars: number;
  url: string;
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
        getDownloads(spec.npm),
      ]);

      return {
        acquired: spec.acquired ?? false,
        downloads,
        name: spec.name,
        points,
        stars,
        url: `https://github.com/${spec.repo}`,
      } satisfies OssProject;
    })
  );

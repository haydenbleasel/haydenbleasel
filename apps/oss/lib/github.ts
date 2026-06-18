import { Octokit } from "octokit";

import { formatVersion } from "@/lib/format";
import type { NpmDownloadTrend } from "@/lib/npm";
import { getRepositoryDownloadTrends } from "@/lib/npm";
import {
  filterVisibleCurrentRepositories,
  getRepositoryTotals,
  sortRepositoriesForDirectory,
} from "@/lib/repositories";

const username = "haydenbleasel";

let octokit: Octokit | undefined;

const getGitHubToken = () => process.env.GITHUB_TOKEN?.trim() || undefined;

const getOctokit = () => {
  octokit ??= new Octokit({
    auth: getGitHubToken(),
  });

  return octokit;
};

export interface GitHubRepositoryPayload {
  archived?: boolean;
  created_at?: string | null;
  description?: string | null;
  fork?: boolean;
  forks_count?: number | null;
  full_name: string;
  homepage?: string | null;
  html_url: string;
  id: number;
  language?: string | null;
  name: string;
  open_issues_count?: number | null;
  pushed_at?: string | null;
  stargazers_count?: number | null;
  topics?: string[];
  updated_at?: string | null;
}

type FormerReason = "Acquired" | "Donated";

export interface OpenSourceRepository {
  archived: boolean;
  createdAt: string;
  description: string | null;
  downloads: NpmDownloadTrend | null;
  fork: boolean;
  forks: number;
  fullName: string;
  formerReason: FormerReason | null;
  homepage: string | null;
  id: number;
  issues: number;
  language: string | null;
  name: string;
  pushedAt: string;
  stars: number;
  status: "active" | "former";
  topics: string[];
  updatedAt: string;
  url: string | null;
}

export interface FeaturedRelease {
  description: string;
  forks: number;
  id: string;
  packageLabel: string;
  releasedAt: string;
  repoName: string;
  stars: number;
  title: string;
  tone: "blue" | "green" | "violet";
  url: string;
}

const formerRepos = [
  { fullName: "shadcnblocks/kibo", reason: "Acquired" },
  { fullName: "vercel/next-forge", reason: "Acquired" },
  { fullName: "vercel-labs/tersa", reason: "Donated" },
  { fullName: "KayleeWilliams/joyful", reason: "Donated" },
  { fullName: "itgalaxy/favicons", reason: "Donated" },
  { fullName: "gulp-community/gulp-favicons", reason: "Donated" },
  { fullName: "nitinthewiz/ghost-phantom", reason: "Donated" },
] satisfies {
  fullName: string;
  reason: FormerReason;
}[];

const manualFormerRepositories = [
  {
    archived: false,
    createdAt: "",
    description:
      "Create realistic, human-like speech and transcribe audio with a unified API that works with leading AI providers like OpenAI, ElevenLabs and AssemblyAI.",
    downloads: null,
    fork: false,
    forks: 0,
    formerReason: "Donated",
    fullName: "haydenbleasel/orate",
    homepage: null,
    id: -1,
    issues: 0,
    language: null,
    name: "haydenbleasel/orate",
    pushedAt: "",
    stars: 0,
    status: "former",
    topics: [],
    updatedAt: "",
    url: null,
  },
] satisfies OpenSourceRepository[];

interface FeaturedReleaseSpec {
  description: string;
  fallbackReleasedAt: string;
  fallbackVersion: string;
  repoName: string;
  title: string;
  tone: FeaturedRelease["tone"];
}

const featuredReleaseSpecs: FeaturedReleaseSpec[] = [
  {
    description:
      "A production-grade, zero-configuration preset for linters and formatters.",
    fallbackReleasedAt: "2026-01-01T00:00:00Z",
    fallbackVersion: "7.8.3",
    repoName: "ultracite",
    title: "Ultracite update",
    tone: "blue",
  },
  {
    description:
      "A unified SDK for S3, R2, GCS, Azure, and every other object or blob store.",
    fallbackReleasedAt: "2026-01-01T00:00:00Z",
    fallbackVersion: "1.9.0",
    repoName: "files-sdk",
    title: "Files SDK released",
    tone: "violet",
  },
  {
    description:
      "Unified batch API for AI providers. Save up to 50% on LLM costs.",
    fallbackReleasedAt: "2026-01-01T00:00:00Z",
    fallbackVersion: "1.0.0",
    repoName: "batchwork",
    title: "Batchwork released",
    tone: "green",
  },
];

export const normalizeRepository = (
  repository: GitHubRepositoryPayload,
  status: OpenSourceRepository["status"] = "active",
  formerReason: FormerReason | null = null
): OpenSourceRepository => ({
  archived: repository.archived ?? false,
  createdAt: repository.created_at ?? repository.updated_at ?? "",
  description: repository.description ?? null,
  downloads: null,
  fork: repository.fork ?? false,
  forks: repository.forks_count ?? 0,
  formerReason,
  fullName: repository.full_name,
  homepage: repository.homepage ?? null,
  id: repository.id,
  issues: repository.open_issues_count ?? 0,
  language: repository.language ?? null,
  name: repository.name,
  pushedAt: repository.pushed_at ?? repository.updated_at ?? "",
  stars: repository.stargazers_count ?? 0,
  status,
  topics: repository.topics ?? [],
  updatedAt: repository.updated_at ?? repository.pushed_at ?? "",
  url: repository.html_url,
});

const fetchRepositories = async () => {
  const client = getOctokit();
  const data = await client.paginate(client.rest.repos.listForUser, {
    per_page: 100,
    sort: "full_name",
    type: "owner",
    username,
  });

  return data.map((repository) => normalizeRepository(repository));
};

const fetchFormerRepositories = async () => {
  const results = await Promise.all(
    formerRepos.map(async ({ fullName, reason }) => {
      const [owner, repo] = fullName.split("/");
      const { data } = await getOctokit().rest.repos.get({ owner, repo });

      return normalizeRepository(data, "former", reason);
    })
  );

  return results;
};

const getLatestRelease = async (repoName: string) => {
  try {
    const { data } = await getOctokit().rest.repos.getLatestRelease({
      owner: username,
      repo: repoName,
    });

    return {
      body: data.body,
      createdAt: data.created_at,
      name: data.name,
      publishedAt: data.published_at,
      tagName: data.tag_name,
      url: data.html_url,
    };
  } catch {
    return null;
  }
};

const getFallbackRelease = (spec: FeaturedReleaseSpec): FeaturedRelease => ({
  description: spec.description,
  forks: 0,
  id: spec.repoName,
  packageLabel: `${spec.repoName}@${spec.fallbackVersion}`,
  releasedAt: spec.fallbackReleasedAt,
  repoName: spec.repoName,
  stars: 0,
  title: spec.title,
  tone: spec.tone,
  url: `https://github.com/${username}/${spec.repoName}`,
});

export const getFallbackOpenSourceData = () => {
  const featured = featuredReleaseSpecs.map(getFallbackRelease);

  return {
    archivedCount: 0,
    featured,
    repositories: [],
    totals: { forks: 0, stars: 0 },
  };
};

const stripMarkdown = (value: string) =>
  value
    .replaceAll(/```[\s\S]*?```/gu, " ")
    .replaceAll(/`(?<code>[^`]+)`/gu, "$<code>")
    .replaceAll(/\[(?<label>[^\]]+)\]\([^)]+\)/gu, "$<label>")
    .replaceAll(/[#>*_~|-]/gu, " ")
    .replaceAll(/\s+/gu, " ")
    .trim();

export const getReleaseDescription = (body: string | null | undefined) => {
  if (!body) {
    return null;
  }

  const description = body
    .split(/\n{2,}/u)
    .map(stripMarkdown)
    .find(Boolean);

  if (!description) {
    return null;
  }

  return description.length > 180
    ? `${description.slice(0, 177).trim()}...`
    : description;
};

const getReleaseTitle = (
  releaseName: string | null | undefined,
  repoName: string,
  version: string
) => {
  if (
    !releaseName ||
    releaseName === version ||
    releaseName === `${repoName}@${version}`
  ) {
    return `${repoName} ${version}`;
  }

  return releaseName;
};

const fetchFeaturedReleases = (repositories: OpenSourceRepository[]) => {
  const repositoryMap = new Map(
    repositories.map((repository) => [repository.name, repository])
  );

  return Promise.all(
    featuredReleaseSpecs.map(async (spec) => {
      const repository = repositoryMap.get(spec.repoName);
      const latestRelease = await getLatestRelease(spec.repoName);
      const version = formatVersion(
        latestRelease?.tagName ?? spec.fallbackVersion,
        spec.repoName
      );
      const releasedAt =
        latestRelease?.publishedAt ??
        latestRelease?.createdAt ??
        spec.fallbackReleasedAt;

      return {
        description:
          getReleaseDescription(latestRelease?.body) ||
          repository?.description ||
          spec.description,
        forks: repository?.forks ?? 0,
        id: spec.repoName,
        packageLabel: `${spec.repoName}@${version}`,
        releasedAt,
        repoName: spec.repoName,
        stars: repository?.stars ?? 0,
        title: getReleaseTitle(latestRelease?.name, spec.repoName, version),
        tone: spec.tone,
        url:
          latestRelease?.url ?? repository?.url ?? getFallbackRelease(spec).url,
      } satisfies FeaturedRelease;
    })
  ).then((releases) =>
    releases.toSorted(
      (a, b) =>
        new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
    )
  );
};

const fetchOpenSourceData = async () => {
  const [repositories, formerRepositories] = await Promise.all([
    fetchRepositories(),
    fetchFormerRepositories(),
  ]);
  const visibleRepositories = filterVisibleCurrentRepositories(repositories);
  const sortedRepositories = sortRepositoriesForDirectory(visibleRepositories);
  const sortedFormerRepositories = sortRepositoriesForDirectory([
    ...formerRepositories,
    ...manualFormerRepositories,
  ]);
  let downloadTrends: Record<string, NpmDownloadTrend> = {};

  try {
    downloadTrends = await getRepositoryDownloadTrends(
      sortedRepositories.map((repository) => repository.name)
    );
  } catch {
    downloadTrends = {};
  }

  const repositoriesWithDownloads = sortedRepositories.map((repository) => ({
    ...repository,
    downloads: downloadTrends[repository.name] ?? null,
  }));

  return {
    archivedCount: repositories.filter(
      (repository) => !repository.fork && repository.archived
    ).length,
    featured: await fetchFeaturedReleases(repositories),
    repositories: [...repositoriesWithDownloads, ...sortedFormerRepositories],
    totals: getRepositoryTotals(sortedRepositories),
  };
};

export const getOpenSourceData = fetchOpenSourceData;

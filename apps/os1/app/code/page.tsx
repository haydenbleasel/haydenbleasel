import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@haydenbleasel/design-system/components/ui/tabs";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

import { PageBody, PageHeader } from "@/components/page-header";
import {
  getFormerRepositories,
  getRepositories,
  getWorkRepositories,
} from "@/lib/github";
import { getBulkDownloads, getPackages } from "@/lib/npm";
import type { NpmPackage } from "@/lib/npm";

import { ContributionGraphClient } from "./contribution-graph";
import { LanguageIcon } from "./language-icon";

export const metadata: Metadata = {
  description: "My open source work on GitHub and npm.",
  title: "Code | OS1",
};

const username = "haydenbleasel";

const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

interface GitHubRepoLike {
  id: number;
  html_url: string;
  name: string;
  full_name: string;
  description: string | null;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
}

interface RepoRow {
  id: number;
  url: string;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
}

const toRepoRows = (
  repos: GitHubRepoLike[],
  { useFullName = false }: { useFullName?: boolean } = {}
): RepoRow[] =>
  repos
    .toSorted((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .map((repo) => ({
      description: repo.description,
      forks: repo.forks_count ?? 0,
      id: repo.id,
      language: repo.language ?? null,
      name: useFullName ? repo.full_name : repo.name,
      stars: repo.stargazers_count ?? 0,
      url: repo.html_url,
    }));

const RepoList = ({ repos }: { repos: RepoRow[] }) => (
  <div className="-ml-3 -mt-2 grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 text-sm">
    {repos.map((repo) => (
      <a
        key={repo.id}
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="col-span-4 grid grid-cols-subgrid items-center rounded-lg px-3 py-2 transition-colors hover:bg-accent"
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{repo.name}</p>
          {repo.description && (
            <p className="truncate text-xs text-muted-foreground">
              {repo.description}
            </p>
          )}
        </div>
        <LanguageIcon language={repo.language} />
        <span className="text-right text-sm text-muted-foreground">
          {formatNumber(repo.stars)} stars
        </span>
        <span className="text-right text-sm text-muted-foreground">
          {formatNumber(repo.forks)} forks
        </span>
      </a>
    ))}
  </div>
);

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
}

const getCachedContributions = unstable_cache(
  async () => {
    const url = new URL(
      `/v4/${username}`,
      "https://github-contributions-api.jogruber.de"
    );
    const response = await fetch(url);
    const data = (await response.json()) as ContributionsResponse;
    const total = data.total[new Date().getFullYear()];
    const [today] = new Date().toISOString().split("T");
    const [oneYearAgo] = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T");
    const contributions = data.contributions.filter(
      (c) => c.date >= oneYearAgo && c.date <= today
    );
    return { contributions, total };
  },
  ["github-contributions"],
  { revalidate: 60 * 60 * 24 }
);

const CodePage = async () => {
  const [repos, workRepos, formerRepos, contributionData, packages] =
    await Promise.all([
      getRepositories(),
      getWorkRepositories(),
      getFormerRepositories(),
      getCachedContributions(),
      getPackages(),
    ]);

  const downloads = await getBulkDownloads(
    packages.map((pkg: NpmPackage) => pkg.name)
  );
  const packagesWithDownloads = packages
    .map((pkg: NpmPackage) => ({
      ...pkg,
      downloads: downloads[pkg.name]?.downloads ?? 0,
    }))
    .toSorted((a, b) => b.downloads - a.downloads);

  const repoSections = [
    {
      label: "Active",
      repos: toRepoRows(repos.filter((repo) => !repo.fork && !repo.archived)),
      value: "active",
    },
    {
      label: "Archived",
      repos: toRepoRows(repos.filter((repo) => !repo.fork && repo.archived)),
      value: "archived",
    },
    {
      label: "Work",
      repos: toRepoRows(workRepos, { useFullName: true }),
      value: "work",
    },
    {
      label: "Former",
      repos: toRepoRows(formerRepos, { useFullName: true }),
      value: "former",
    },
  ].filter((section) => section.repos.length > 0);

  const tabs = [
    ...repoSections.map((section) => ({
      label: section.label,
      value: section.value,
    })),
    ...(packagesWithDownloads.length > 0
      ? [{ label: "Packages", value: "packages" }]
      : []),
  ];

  return (
    <Tabs defaultValue={tabs[0]?.value}>
      <PageHeader title="Code" withTabs>
        <TabsList className="gap-4" variant="line">
          {tabs.map((tab) => (
            <TabsTrigger
              className="flex-none px-0 font-normal"
              key={tab.value}
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </PageHeader>

      <PageBody>
        <ContributionGraphClient
          contributions={contributionData.contributions}
          totalCount={contributionData.total ?? 0}
        />

        {repoSections.map((section) => (
          <TabsContent key={section.value} value={section.value}>
            <RepoList repos={section.repos} />
          </TabsContent>
        ))}

        {packagesWithDownloads.length > 0 && (
          <TabsContent value="packages">
            <div className="-ml-3 -mt-2 grid gap-2 text-sm">
              {packagesWithDownloads.map((pkg) => (
                <a
                  key={pkg.name}
                  href={pkg.links.npm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-accent sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{pkg.name}</p>
                    {pkg.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-4 text-sm text-muted-foreground">
                    <span>v{pkg.version}</span>
                    <span>{formatNumber(pkg.downloads)} downloads/yr</span>
                  </div>
                </a>
              ))}
            </div>
          </TabsContent>
        )}
      </PageBody>
    </Tabs>
  );
};

export default CodePage;

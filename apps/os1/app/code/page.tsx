import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

import { PageHeader } from "@/components/page-header";
import { getRepositories, getWorkRepositories } from "@/lib/github";
import { getBulkDownloads, getPackages } from "@/lib/npm";
import type { NpmPackage } from "@/lib/npm";

import { ContributionGraphClient } from "./contribution-graph";
import { LanguageIcon } from "./language-icon";

export const metadata: Metadata = {
  description: "My open source work on GitHub and npm.",
  title: "Code | OS1",
};

const username = "haydenbleasel";

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

const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const CodePage = async () => {
  const [repos, workRepos, contributionData, packages] = await Promise.all([
    getRepositories(),
    getWorkRepositories(),
    getCachedContributions(),
    getPackages(),
  ]);

  const downloads = await getBulkDownloads(
    packages.map((pkg: NpmPackage) => pkg.name)
  );
  const packagesWithDownloads = packages.map((pkg: NpmPackage) => ({
    ...pkg,
    downloads: downloads[pkg.name]?.downloads ?? 0,
  }));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Code"
        description={`${formatNumber(contributionData.total ?? 0)} contributions this year.`}
      />

      <ContributionGraphClient
        contributions={contributionData.contributions}
        totalCount={contributionData.total ?? 0}
      />

      <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
        <div className="px-4 pt-2 pb-1">
          <h2 className="text-sm font-medium text-muted-foreground">
            Active Repositories
          </h2>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 rounded-2xl bg-background p-2 text-sm shadow-sm/5">
          {repos
            .filter((repo) => !repo.fork && !repo.archived)
            .toSorted(
              (a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)
            )
            .map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
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
                <LanguageIcon language={repo.language ?? null} />
                <span className="text-right text-sm text-muted-foreground">
                  {formatNumber(repo.stargazers_count ?? 0)} stars
                </span>
                <span className="text-right text-sm text-muted-foreground">
                  {formatNumber(repo.forks_count ?? 0)} forks
                </span>
              </a>
            ))}
        </div>
      </section>

      {repos.some((repo) => !repo.fork && repo.archived) && (
        <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              Archived Repositories
            </h2>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 rounded-2xl bg-background p-2 text-sm shadow-sm/5">
            {repos
              .filter((repo) => !repo.fork && repo.archived)
              .toSorted(
                (a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)
              )
              .map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
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
                  <LanguageIcon language={repo.language ?? null} />
                  <span className="text-right text-sm text-muted-foreground">
                    {formatNumber(repo.stargazers_count ?? 0)} stars
                  </span>
                  <span className="text-right text-sm text-muted-foreground">
                    {formatNumber(repo.forks_count ?? 0)} forks
                  </span>
                </a>
              ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
        <div className="px-4 pt-2 pb-1">
          <h2 className="text-sm font-medium text-muted-foreground">
            Work Repositories
          </h2>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 rounded-2xl bg-background p-2 text-sm shadow-sm/5">
          {workRepos
            .toSorted(
              (a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)
            )
            .map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-4 grid grid-cols-subgrid items-center rounded-lg px-3 py-2 transition-colors hover:bg-accent"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{repo.full_name}</p>
                  {repo.description && (
                    <p className="truncate text-xs text-muted-foreground">
                      {repo.description}
                    </p>
                  )}
                </div>
                <LanguageIcon language={repo.language ?? null} />
                <span className="text-right text-sm text-muted-foreground">
                  {formatNumber(repo.stargazers_count ?? 0)} stars
                </span>
                <span className="text-right text-sm text-muted-foreground">
                  {formatNumber(repo.forks_count ?? 0)} forks
                </span>
              </a>
            ))}
        </div>
      </section>

      {packagesWithDownloads.length > 0 && (
        <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              npm Packages
            </h2>
          </div>
          <div className="grid gap-2 rounded-2xl bg-background p-2 text-sm shadow-sm/5">
            {packagesWithDownloads
              .toSorted((a, b) => b.downloads - a.downloads)
              .map((pkg) => (
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
        </section>
      )}
    </div>
  );
};

export default CodePage;

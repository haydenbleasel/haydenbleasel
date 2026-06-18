import { Button } from "@haydenbleasel/design-system/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { unstable_cache } from "next/cache";

import { FeaturedReleaseCard } from "@/app/components/featured-release-card";
import { ProjectList } from "@/app/components/project-list";
import { getFallbackOpenSourceData, getOpenSourceData } from "@/lib/github";

export const dynamic = "force-dynamic";

const getCachedOpenSourceData = unstable_cache(
  getOpenSourceData,
  ["oss-page-data"],
  {
    revalidate: 60 * 60 * 3,
  }
);

const GithubMark = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    fill="none"
    viewBox="0 0 1024 1024"
  >
    <path
      clipRule="evenodd"
      d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
      fill="currentColor"
      fillRule="evenodd"
      transform="scale(64)"
    />
  </svg>
);

const getPageData = async () => {
  try {
    return await getCachedOpenSourceData();
  } catch (error) {
    console.error(error);
    return getFallbackOpenSourceData();
  }
};

const OssPage = async () => {
  const data = await getPageData();
  const [primaryRelease, ...secondaryReleases] = data.featured;

  return (
    <main className="mx-auto grid w-full max-w-[1600px] gap-20 px-6 py-16 sm:p-16 lg:p-24">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="grid gap-1">
          <h1 className="font-medium text-[28px] leading-tight">
            haydenbleasel/oss
          </h1>
          <p className="text-[28px] leading-tight text-foreground/50">
            My open source software updates
          </p>
        </div>
        <Button asChild className="self-start" variant="ghost">
          <a
            href="https://github.com/haydenbleasel"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubMark />
            GitHub
            <ArrowUpRight />
          </a>
        </Button>
      </header>

      {primaryRelease && (
        <section className="grid gap-10 lg:grid-cols-[minmax(0,770px)_minmax(280px,1fr)] lg:items-stretch">
          <FeaturedReleaseCard prominence="primary" release={primaryRelease} />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            {secondaryReleases.map((release) => (
              <FeaturedReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </section>
      )}

      <ProjectList projects={data.repositories} />
    </main>
  );
};

export default OssPage;

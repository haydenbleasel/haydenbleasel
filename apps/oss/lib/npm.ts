interface NpmPackage {
  name: string;
  version: string;
  links: {
    homepage?: string;
    npm: string;
    repository?: string;
  };
  maintainers: {
    email: string;
    username: string;
  }[];
}

interface NpmSearchResponse {
  objects: {
    package: NpmPackage;
  }[];
}

interface NpmDownloadDay {
  day: string;
  downloads: number;
}

interface NpmDownloadRangeResponse {
  downloads: NpmDownloadDay[];
  end: string;
  package: string;
  start: string;
}

export interface NpmDownloadTrend {
  packageNames: string[];
  points: number[];
  total: number;
}

const username = "haydenbleasel";
const ignoredDownloadRepositories = new Set([
  "haydenbleasel",
  "stripe-migrate",
]);
const ignoredDownloadPackages = new Set(["tiptap-extensions"]);
const allowedDownloadPackagesByRepositoryName = new Map([
  ["tiptap-extensions", new Set(["tiptap-extension-iframely"])],
]);
const repositoryNameByPackageName = new Map([
  ["tiptap-extension-iframely", "tiptap-extensions"],
]);

export const toDownloadSparklinePoints = (
  downloads: NpmDownloadDay[],
  bucketCount = 24
) => {
  if (downloads.length === 0) {
    return [];
  }

  const bucketSize = Math.ceil(downloads.length / bucketCount);
  const points: number[] = [];

  for (let index = 0; index < downloads.length; index += bucketSize) {
    const bucket = downloads.slice(index, index + bucketSize);
    let total = 0;

    for (const day of bucket) {
      total += day.downloads;
    }

    points.push(total);
  }

  return points;
};

const getPackageRepositoryName = (pkg: NpmPackage) => {
  const overriddenRepositoryName = repositoryNameByPackageName.get(pkg.name);

  if (overriddenRepositoryName) {
    return overriddenRepositoryName;
  }

  const packageName = pkg.name.includes("/")
    ? (pkg.name.split("/").pop() ?? pkg.name)
    : pkg.name;
  const repositoryUrl = pkg.links.repository ?? pkg.links.homepage;

  if (!repositoryUrl) {
    return packageName;
  }

  if (repositoryUrl.startsWith("github:")) {
    return (
      repositoryUrl
        .split("/")
        .pop()
        ?.replace(/\.git$/u, "") ?? packageName
    );
  }

  const urlValue = repositoryUrl.startsWith("git+")
    ? repositoryUrl.slice(4)
    : repositoryUrl;

  try {
    const url = new URL(urlValue);
    const segments = url.pathname.split("/").filter(Boolean);
    const repo = segments.at(-1);

    return repo?.replace(/\.git$/u, "") ?? packageName;
  } catch {
    return packageName;
  }
};

const getPackages = async () => {
  const response = await fetch(
    `https://registry.npmjs.org/-/v1/search?text=maintainer:${username}&size=250`
  );

  if (!response.ok) {
    throw new Error(`npm API error: ${response.status}`);
  }

  const data = (await response.json()) as NpmSearchResponse;

  return data.objects
    .map((object) => object.package)
    .filter((pkg) => pkg.version !== "0.0.0")
    .filter((pkg) => pkg.maintainers.some((m) => m.username === username));
};

const getPackageDownloadRange = async (packageName: string) => {
  const response = await fetch(
    `https://api.npmjs.org/downloads/range/last-year/${encodeURIComponent(
      packageName
    )}`
  );

  if (!response.ok) {
    throw new Error(`npm API error: ${response.status}`);
  }

  return (await response.json()) as NpmDownloadRangeResponse;
};

const combinePackageRanges = (ranges: NpmDownloadRangeResponse[]) => {
  const downloadsByDay = new Map<string, number>();
  let total = 0;

  for (const range of ranges) {
    for (const day of range.downloads) {
      const downloads = downloadsByDay.get(day.day) ?? 0;

      downloadsByDay.set(day.day, downloads + day.downloads);
      total += day.downloads;
    }
  }

  const downloads = [...downloadsByDay.entries()]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([day, dayDownloads]) => ({
      day,
      downloads: dayDownloads,
    }));

  return {
    points: toDownloadSparklinePoints(downloads),
    total,
  };
};

export const getRepositoryDownloadTrends = async (
  repositoryNames: string[]
) => {
  const repositoryNameSet = new Set(repositoryNames);
  const packages = await getPackages();
  const packagesByRepository = new Map<string, NpmPackage[]>();

  for (const pkg of packages) {
    if (ignoredDownloadPackages.has(pkg.name)) {
      continue;
    }

    const repositoryName = getPackageRepositoryName(pkg);

    if (
      !repositoryNameSet.has(repositoryName) ||
      ignoredDownloadRepositories.has(repositoryName)
    ) {
      continue;
    }

    const allowedPackages =
      allowedDownloadPackagesByRepositoryName.get(repositoryName);

    if (allowedPackages && !allowedPackages.has(pkg.name)) {
      continue;
    }

    const repositoryPackages = packagesByRepository.get(repositoryName) ?? [];

    repositoryPackages.push(pkg);
    packagesByRepository.set(repositoryName, repositoryPackages);
  }

  const entries = await Promise.all(
    [...packagesByRepository.entries()].map(async ([repositoryName, pkgs]) => {
      const ranges = await Promise.all(
        pkgs.map((pkg) => getPackageDownloadRange(pkg.name))
      );
      const trend = combinePackageRanges(ranges);

      return [
        repositoryName,
        {
          ...trend,
          packageNames: pkgs.map((pkg) => pkg.name),
        },
      ] as const;
    })
  );

  return Object.fromEntries(entries) as Record<string, NpmDownloadTrend>;
};

interface NpmPackage {
  name: string;
  description: string;
  version: string;
  date: string;
  links: {
    npm: string;
    homepage?: string;
    repository?: string;
  };
  maintainers: {
    username: string;
    email: string;
  }[];
}

interface NpmSearchResponse {
  objects: {
    package: NpmPackage;
    score: {
      final: number;
    };
  }[];
}

interface NpmDownloads {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

export type { NpmPackage };

export const getPackages = async (): Promise<NpmPackage[]> => {
  const response = await fetch(
    "https://registry.npmjs.org/-/v1/search?text=maintainer:haydenbleasel&size=250"
  );

  if (!response.ok) {
    throw new Error(`npm API error: ${response.status}`);
  }

  const data = (await response.json()) as NpmSearchResponse;
  return data.objects
    .map((obj) => obj.package)
    .filter((pkg) => pkg.version !== "0.0.0")
    .filter((pkg) =>
      pkg.maintainers.some((m) => m.username === "haydenbleasel")
    );
};

export const getBulkDownloads = async (
  packageNames: string[]
): Promise<Record<string, NpmDownloads>> => {
  const scoped: string[] = [];
  const unscoped: string[] = [];

  for (const name of packageNames) {
    if (name.startsWith("@")) {
      scoped.push(name);
    } else {
      unscoped.push(name);
    }
  }

  const results: Record<string, NpmDownloads> = {};

  if (unscoped.length > 0) {
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/last-year/${unscoped.join(",")}`
    );

    if (!response.ok) {
      throw new Error(`npm API error: ${response.status}`);
    }

    const data = (await response.json()) as Record<string, NpmDownloads>;
    Object.assign(results, data);
  }

  for (const name of scoped) {
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/last-year/${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      throw new Error(`npm API error: ${response.status}`);
    }

    results[name] = (await response.json()) as NpmDownloads;
  }

  return results;
};

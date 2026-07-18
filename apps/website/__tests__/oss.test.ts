import { afterEach, describe, expect, mock, test } from "bun:test";

mock.module("astro:env/server", () => ({ GITHUB_TOKEN: "test-token" }));

const { getOssProjects } = await import("../src/lib/oss");

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

type FetchStub = (url: string, init?: RequestInit) => Promise<Response>;

const installFetch = (stub: FetchStub) => {
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) =>
    stub(String(input), init)) as typeof fetch;
};

const jsonResponse = (data: unknown, ok = true): Response =>
  ({ json: () => Promise.resolve(data), ok }) as Response;

const dailyDownloads = (days: number, perDay: number) =>
  Array.from({ length: days }, (_, index) => ({
    day: `2026-01-${index + 1}`,
    downloads: perDay,
  }));

describe("getOssProjects", () => {
  test("returns the curated projects in order with their github urls", async () => {
    installFetch((url) => {
      if (url.includes("api.github.com/repos/")) {
        return Promise.resolve(jsonResponse({ stargazers_count: 100 }));
      }

      return Promise.resolve(
        jsonResponse({ downloads: dailyDownloads(30, 10) })
      );
    });

    const projects = await getOssProjects();

    expect(projects.map((project) => project.name)).toEqual([
      "ultracite",
      "files-sdk",
      "blume",
      "next-forge",
      "kibo-ui",
    ]);
    expect(projects[0].url).toBe("https://github.com/haydenbleasel/ultracite");
    expect(projects.find((p) => p.name === "next-forge")?.url).toBe(
      "https://github.com/vercel/next-forge"
    );
    expect(projects.find((p) => p.name === "kibo-ui")?.url).toBe(
      "https://github.com/shadcnblocks/kibo"
    );
  });

  test("parses stars, total downloads and a sparkline", async () => {
    installFetch((url) => {
      if (url.includes("api.github.com/repos/")) {
        return Promise.resolve(jsonResponse({ stargazers_count: 100 }));
      }

      return Promise.resolve(
        jsonResponse({ downloads: dailyDownloads(30, 10) })
      );
    });

    const [ultracite] = await getOssProjects();

    expect(ultracite.stars).toBe(100);
    expect(ultracite.downloads).toBe(300);
    expect(ultracite.points.length).toBeGreaterThanOrEqual(2);
  });

  test("flags acquired projects", async () => {
    installFetch(() =>
      Promise.resolve(jsonResponse({ downloads: [], stargazers_count: 0 }))
    );

    const projects = await getOssProjects();
    const acquired = projects
      .filter((project) => project.acquired)
      .map((project) => project.name);

    expect(acquired).toEqual(["next-forge", "kibo-ui"]);
  });

  test("sends the GitHub token when present", async () => {
    let githubInit: RequestInit | undefined;

    installFetch((url, init) => {
      if (url.includes("api.github.com/repos/")) {
        githubInit = init;
      }

      return Promise.resolve(
        jsonResponse({ downloads: [], stargazers_count: 0 })
      );
    });

    await getOssProjects();

    const headers = githubInit?.headers as Record<string, string> | undefined;

    expect(headers?.authorization).toBe("Bearer test-token");
  });

  test("falls back to zeros when a request rejects", async () => {
    installFetch(() => Promise.reject(new Error("network")));

    const projects = await getOssProjects();

    expect(projects).toHaveLength(5);
    for (const project of projects) {
      expect(project.stars).toBe(0);
      expect(project.downloads).toBe(0);
      expect(project.points).toEqual([]);
    }
  });

  test("falls back to zeros on non-ok responses", async () => {
    installFetch(() => Promise.resolve(jsonResponse({}, false)));

    const [ultracite] = await getOssProjects();

    expect(ultracite.stars).toBe(0);
    expect(ultracite.downloads).toBe(0);
    expect(ultracite.points).toEqual([]);
  });
});

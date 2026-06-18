import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  getRepositoryDownloadTrends,
  toDownloadSparklinePoints,
} from "../lib/npm";

const originalFetch = globalThis.fetch;

const buildPackage = ({
  name,
  repository,
}: {
  name: string;
  repository?: string;
}) => ({
  links: {
    npm: `https://npmjs.com/package/${name}`,
    repository,
  },
  maintainers: [{ email: "x@y.com", username: "haydenbleasel" }],
  name,
  version: "1.0.0",
});

describe("npm", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("buckets download days into sparkline points", () => {
    expect(
      toDownloadSparklinePoints(
        [
          { day: "2026-01-01", downloads: 1 },
          { day: "2026-01-02", downloads: 2 },
          { day: "2026-01-03", downloads: 3 },
          { day: "2026-01-04", downloads: 4 },
        ],
        2
      )
    ).toEqual([3, 7]);
  });

  test("maps npm packages to repositories and aggregates downloads", async () => {
    globalThis.fetch = mock((input: string | URL | Request) => {
      const url = input.toString();

      if (url.includes("registry.npmjs.org")) {
        return Response.json({
          objects: [
            {
              package: buildPackage({
                name: "ultracite",
                repository: "https://github.com/haydenbleasel/ultracite.git",
              }),
            },
            {
              package: buildPackage({
                name: "ignored",
                repository: "https://github.com/haydenbleasel/ignored.git",
              }),
            },
          ],
        });
      }

      return Response.json({
        downloads: [
          { day: "2026-01-01", downloads: 10 },
          { day: "2026-01-02", downloads: 20 },
          { day: "2026-01-03", downloads: 30 },
        ],
        end: "2026-01-03",
        package: "ultracite",
        start: "2026-01-01",
      });
    }) as unknown as typeof fetch;

    const trends = await getRepositoryDownloadTrends(["ultracite"]);

    expect(trends.ultracite?.packageNames).toEqual(["ultracite"]);
    expect(trends.ultracite?.points).toEqual([10, 20, 30]);
    expect(trends.ultracite?.total).toBe(60);
  });

  test("excludes npx command packages from download trends", async () => {
    const fetchMock = mock((input: string | URL | Request) => {
      const url = input.toString();

      if (url.includes("registry.npmjs.org")) {
        return Response.json({
          objects: [
            {
              package: buildPackage({
                name: "stripe-migrate",
                repository:
                  "https://github.com/haydenbleasel/stripe-migrate.git",
              }),
            },
            {
              package: buildPackage({
                name: "haydenbleasel",
                repository:
                  "https://github.com/haydenbleasel/haydenbleasel.git",
              }),
            },
          ],
        });
      }

      return Response.json({
        downloads: [{ day: "2026-01-01", downloads: 10 }],
        end: "2026-01-01",
        package: "stripe-migrate",
        start: "2026-01-01",
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const trends = await getRepositoryDownloadTrends([
      "haydenbleasel",
      "stripe-migrate",
    ]);

    expect(trends).toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("tracks overridden npm package names for repositories", async () => {
    const fetchMock = mock((input: string | URL | Request) => {
      const url = input.toString();

      if (url.includes("registry.npmjs.org")) {
        return Response.json({
          objects: [
            {
              package: buildPackage({
                name: "tiptap-extensions",
                repository:
                  "https://github.com/haydenbleasel/tiptap-extensions.git",
              }),
            },
            {
              package: buildPackage({
                name: "tiptap-extension-iframely",
                repository:
                  "https://github.com/haydenbleasel/tiptap-extension-iframely.git",
              }),
            },
            {
              package: buildPackage({
                name: "tiptap-extension-jira",
                repository:
                  "https://github.com/haydenbleasel/tiptap-extensions.git",
              }),
            },
            {
              package: buildPackage({
                name: "tiptap-extension-figma",
                repository:
                  "https://github.com/haydenbleasel/tiptap-extensions.git",
              }),
            },
          ],
        });
      }

      return Response.json({
        downloads: [{ day: "2026-01-01", downloads: 42 }],
        end: "2026-01-01",
        package: "tiptap-extension-iframely",
        start: "2026-01-01",
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const trends = await getRepositoryDownloadTrends(["tiptap-extensions"]);

    expect(trends["tiptap-extensions"]?.packageNames).toEqual([
      "tiptap-extension-iframely",
    ]);
    expect(trends["tiptap-extensions"]?.total).toBe(42);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

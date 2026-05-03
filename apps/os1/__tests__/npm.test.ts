import { afterEach, describe, expect, mock, test } from "bun:test";

const originalFetch = globalThis.fetch;

const buildPackage = (overrides: {
  name: string;
  version?: string;
  maintainers?: { username: string; email: string }[];
}) => ({
  date: "2026-01-01",
  description: "",
  links: { npm: `https://npmjs.com/package/${overrides.name}` },
  maintainers: overrides.maintainers ?? [
    { email: "x@y.com", username: "haydenbleasel" },
  ],
  name: overrides.name,
  version: overrides.version ?? "1.0.0",
});

describe("npm", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("getPackages", () => {
    test("filters out v0.0.0 stubs and packages not maintained by haydenbleasel", async () => {
      globalThis.fetch = mock(() =>
        Response.json({
          objects: [
            { package: buildPackage({ name: "good" }), score: { final: 1 } },
            {
              package: buildPackage({ name: "stub", version: "0.0.0" }),
              score: { final: 0 },
            },
            {
              package: buildPackage({
                maintainers: [{ email: "x@y.com", username: "someone" }],
                name: "other",
              }),
              score: { final: 0 },
            },
          ],
        })
      ) as unknown as typeof fetch;

      const { getPackages } = await import("../lib/npm");
      const packages = await getPackages();

      expect(packages.map((p) => p.name)).toEqual(["good"]);
    });

    test("throws when the registry responds with an error", async () => {
      globalThis.fetch = mock(
        () => new Response("", { status: 500 })
      ) as unknown as typeof fetch;

      const { getPackages } = await import("../lib/npm");

      expect(getPackages()).rejects.toThrow("npm API error: 500");
    });
  });

  describe("getBulkDownloads", () => {
    test("batches unscoped names into a single call and fetches scoped names individually", async () => {
      const fetchMock = mock((input: string | URL | Request) => {
        const u = input.toString();

        if (u.includes("downloads/point/last-year/foo,bar")) {
          return Response.json({
            bar: { downloads: 200, end: "b", package: "bar", start: "a" },
            foo: { downloads: 100, end: "b", package: "foo", start: "a" },
          });
        }

        return Response.json({
          downloads: 50,
          end: "b",
          package: "@scope/pkg",
          start: "a",
        });
      });
      globalThis.fetch = fetchMock as unknown as typeof fetch;

      const { getBulkDownloads } = await import("../lib/npm");
      const result = await getBulkDownloads(["foo", "bar", "@scope/pkg"]);

      expect(result.foo?.downloads).toBe(100);
      expect(result.bar?.downloads).toBe(200);
      expect(result["@scope/pkg"]?.downloads).toBe(50);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("skips the bulk endpoint when only scoped names are provided", async () => {
      const fetchMock = mock(() =>
        Response.json({ downloads: 5, end: "b", package: "@a/b", start: "a" })
      );
      globalThis.fetch = fetchMock as unknown as typeof fetch;

      const { getBulkDownloads } = await import("../lib/npm");
      const result = await getBulkDownloads(["@a/b"]);

      expect(result["@a/b"]?.downloads).toBe(5);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test("url-encodes scoped package names", async () => {
      const fetchMock = mock((_input: string | URL | Request) =>
        Response.json({
          downloads: 0,
          end: "b",
          package: "@scope/pkg",
          start: "a",
        })
      );
      globalThis.fetch = fetchMock as unknown as typeof fetch;

      const { getBulkDownloads } = await import("../lib/npm");
      await getBulkDownloads(["@scope/pkg"]);

      const calledUrl = (fetchMock.mock.calls[0]?.[0] ?? "").toString();

      expect(calledUrl).toContain("%40scope%2Fpkg");
    });

    test("throws when the bulk endpoint fails", async () => {
      globalThis.fetch = mock(
        () => new Response("", { status: 503 })
      ) as unknown as typeof fetch;

      const { getBulkDownloads } = await import("../lib/npm");

      expect(getBulkDownloads(["foo"])).rejects.toThrow("npm API error: 503");
    });

    test("throws when a scoped request fails", async () => {
      globalThis.fetch = mock(
        () => new Response("", { status: 502 })
      ) as unknown as typeof fetch;

      const { getBulkDownloads } = await import("../lib/npm");

      expect(getBulkDownloads(["@a/b"])).rejects.toThrow("npm API error: 502");
    });
  });
});

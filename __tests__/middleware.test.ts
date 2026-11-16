import { describe, expect, mock, test } from "bun:test";

import { onRequest } from "../src/middleware";

type Context = Parameters<typeof onRequest>[0];

const request = async (path: string) => {
  const next = mock(() => Promise.resolve(new Response("page")));
  const redirect = mock(
    (location: string, status: number) =>
      new Response(null, { headers: { location }, status })
  );
  const url = new URL(path, "https://haydenbleasel.com");
  const response = await onRequest(
    { redirect, url } as unknown as Context,
    next
  );
  return { next, redirect, response };
};

describe("middleware redirects", () => {
  test.each([
    ["/blog", "https://haydenbleasel.com/writing", 308],
    ["/blog/", "https://haydenbleasel.com/writing", 308],
    ["/blog/presumi", "https://haydenbleasel.com/writing/presumi", 308],
    ["/taking-away", "https://haydenbleasel.com/writing/taking-away", 308],
    ["/taking-away/", "https://haydenbleasel.com/writing/taking-away", 308],
    ["/by-taking-away", "https://haydenbleasel.com/writing/taking-away", 308],
    [
      "/taking-away.md",
      "https://haydenbleasel.com/writing/taking-away.md",
      308,
    ],
    [
      "/og/taking-away.png",
      "https://haydenbleasel.com/og/writing/taking-away.png",
      308,
    ],
    ["/blog/clipchamp", "https://haydenbleasel.com/writing/clipchamp", 308],
    ["/projects/harmony", "https://haydenbleasel.com/writing/ultracite", 308],
    ["/apps", "https://haydenbleasel.com/about#projects", 308],
    ["/feed", "https://haydenbleasel.com/rss.xml", 308],
    [
      "/presumi-uts.pdf",
      "https://www.uts.edu.au/news/2016/06/hard-slog-and-serendipity-path-overnight-success",
      308,
    ],
    ["/games", "https://haydenbleasel.com/", 307],
    ["/posts", "https://x.com/haydenbleasel", 308],
    ["/contact", "https://x.com/haydenbleasel", 307],
  ])("%s redirects to %s with a %d", async (path, location, status) => {
    const { next, redirect } = await request(path);

    expect(redirect).toHaveBeenCalledWith(location, status);
    expect(next).not.toHaveBeenCalled();
  });

  test("keeps the query string", async () => {
    const { redirect } = await request("/blog?ref=newsletter");

    expect(redirect).toHaveBeenCalledWith(
      "https://haydenbleasel.com/writing?ref=newsletter",
      308
    );
  });

  test("a /:path* source matches itself and everything beneath it", async () => {
    const requests = await Promise.all(
      ["/work", "/work/", "/work/refraction/case-study"].map(request)
    );
    for (const { redirect } of requests) {
      expect(redirect).toHaveBeenCalledWith(
        "https://haydenbleasel.com/about#work",
        308
      );
    }

    const { redirect } = await request("/work/refraction?tab=1");
    expect(redirect).toHaveBeenCalledWith(
      "https://haydenbleasel.com/about?tab=1#work",
      308
    );
  });

  test.each(["/", "/writing", "/workshop", "/blogroll", "/blog/unknown-post"])(
    "passes %s through to the site",
    async (path) => {
      const { next, redirect, response } = await request(path);

      expect(redirect).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(await response?.text()).toBe("page");
    }
  );
});

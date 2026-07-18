import { describe, expect, test } from "bun:test";

import { GET } from "../src/pages/robots.txt";

const call = () => GET({} as unknown as Parameters<typeof GET>[0]) as Response;

describe("robots", () => {
  test("returns plain text", async () => {
    const response = call();

    expect(response.headers.get("content-type")).toContain("text/plain");
    await response.text();
  });

  test("allows all user agents", async () => {
    const body = await call().text();

    expect(body).toContain("User-agent: *");
    expect(body).toContain("Allow: /");
  });

  test("includes sitemap URL", async () => {
    const body = await call().text();

    expect(body).toContain("Sitemap:");
    expect(body).toContain("/sitemap.xml");
  });
});

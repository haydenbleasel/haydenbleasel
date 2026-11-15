import { expect, test } from "bun:test";

import { ALL, prerender } from "../src/pages/[...path]";
import { bindings } from "./support/preload";

type Context = Parameters<typeof ALL>[0];

test("unmatched paths run on demand, so middleware can redirect them", () => {
  expect(prerender).toBe(false);
});

test("answers with the prerendered 404 page and a 404 status", async () => {
  const response = await ALL({
    url: new URL("https://haydenbleasel.com/nope/deeper?ref=x"),
  } as Context);

  expect(bindings.ASSETS.fetch).toHaveBeenCalledWith(
    new URL("https://haydenbleasel.com/404")
  );
  expect(response.status).toBe(404);
  expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
  expect(await response.text()).toBe("<h1>Page not found</h1>");
});

import { expect, test } from "bun:test";
import path from "node:path";

import { Glob } from "bun";

const SOURCE_ROOT = path.join(import.meta.dir, "..", "src");

const scan = (pattern: string) =>
  Array.fromAsync(new Glob(pattern).scan({ cwd: SOURCE_ROOT }));

// Tests live in __tests__/. One under src/ would be imported by the test below,
// registering its tests inside a running one.
test("keeps test files out of src/", async () => {
  expect(await scan("**/*.test.ts")).toEqual([]);
});

// Bun only reports coverage for files a test loads. Loading every source module
// means one without tests shows up uncovered and fails the coverage threshold,
// instead of going unreported.
test("every source module loads", async () => {
  const sources = await scan("**/*.ts");
  const files = sources.filter((file) => !file.endsWith(".test.ts"));
  const modules = await Promise.all(
    files.map(async (file) => await import(path.join(SOURCE_ROOT, file)))
  );

  expect(modules.length).toBeGreaterThan(20);
});

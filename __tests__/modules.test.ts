import { expect, test } from "bun:test";
import path from "node:path";

import { Glob } from "bun";

const SOURCE_ROOT = path.join(import.meta.dir, "..", "src");

// Bun only reports coverage for files a test loads. Loading every source module
// means one without tests shows up uncovered and fails the coverage threshold,
// instead of going unreported.
test("every source module loads", async () => {
  const files = await Array.fromAsync(
    new Glob("**/*.ts").scan({ cwd: SOURCE_ROOT })
  );
  const modules = await Promise.all(
    files.map(async (file) => await import(path.join(SOURCE_ROOT, file)))
  );

  expect(modules.length).toBeGreaterThan(20);
});

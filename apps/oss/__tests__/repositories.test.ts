import { describe, expect, test } from "bun:test";

import {
  filterVisibleCurrentRepositories,
  getRepositoryTotals,
  sortRepositoriesForDirectory,
} from "../lib/repositories";

describe("repositories", () => {
  test("sorts by stars, updated date, then name", () => {
    const repositories = [
      { forks: 1, name: "beta", stars: 5, updatedAt: "2026-01-01" },
      { forks: 1, name: "alpha", stars: 10, updatedAt: "2026-01-01" },
      { forks: 1, name: "gamma", stars: 10, updatedAt: "2026-02-01" },
    ];

    expect(
      sortRepositoriesForDirectory(repositories).map((repo) => repo.name)
    ).toEqual(["gamma", "alpha", "beta"]);
  });

  test("totals repository metrics", () => {
    expect(
      getRepositoryTotals([
        { forks: 2, stars: 5 },
        { forks: 3, stars: 8 },
      ])
    ).toEqual({ forks: 5, stars: 13 });
  });

  test("filters hidden and non-current repositories", () => {
    const repositories = [
      { archived: false, fork: false, name: "files-sdk" },
      { archived: false, fork: false, name: "haydenbleasel" },
      { archived: true, fork: false, name: "archived-package" },
      { archived: false, fork: true, name: "forked-package" },
    ];

    expect(
      filterVisibleCurrentRepositories(repositories).map((repo) => repo.name)
    ).toEqual(["files-sdk"]);
  });
});

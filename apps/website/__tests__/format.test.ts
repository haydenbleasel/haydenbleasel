import { describe, expect, test } from "bun:test";

import {
  formatCompactNumber,
  getSparklinePath,
  toSparklinePoints,
} from "../src/lib/format";

describe("formatCompactNumber", () => {
  test("formats thousands and millions compactly", () => {
    expect(formatCompactNumber(1442)).toBe("1.4K");
    expect(formatCompactNumber(3_000_000)).toBe("3M");
  });

  test("drops a trailing .0", () => {
    expect(formatCompactNumber(2000)).toBe("2K");
  });
});

describe("toSparklinePoints", () => {
  test("returns an empty array for no data", () => {
    expect(toSparklinePoints([])).toEqual([]);
  });

  test("buckets daily values and preserves the total", () => {
    const daily = Array.from({ length: 48 }, () => 1);
    const points = toSparklinePoints(daily, 24);

    expect(points.length).toBeLessThanOrEqual(24);
    expect(points.reduce((sum, value) => sum + value, 0)).toBe(48);
  });
});

describe("getSparklinePath", () => {
  test("returns empty string for fewer than two points", () => {
    expect(getSparklinePath([5])).toBe("");
  });

  test("builds a move-then-line path within the viewBox", () => {
    const path = getSparklinePath([1, 5, 3]);

    expect(path.startsWith("M")).toBe(true);
    expect(path).toContain("L");
  });
});

import { describe, expect, test } from "bun:test";

import {
  formatCompactNumber,
  formatDate,
  formatRelativeDate,
  formatVersion,
} from "../lib/format";

describe("format", () => {
  test("formats compact numbers without redundant decimals", () => {
    expect(formatCompactNumber(999)).toBe("999");
    expect(formatCompactNumber(1000)).toBe("1K");
    expect(formatCompactNumber(1250)).toBe("1.3K");
    expect(formatCompactNumber(1_000_000)).toBe("1M");
  });

  test("formats dates in UTC", () => {
    expect(formatDate("2026-06-17T02:00:00Z")).toBe("Jun 17, 2026");
  });

  test("formats relative dates", () => {
    const now = new Date("2026-06-19T12:00:00Z");

    expect(formatRelativeDate("2026-06-17T12:00:00Z", now)).toBe("2 days ago");
    expect(formatRelativeDate("2026-06-19T11:59:30Z", now)).toBe("now");
  });

  test("normalizes release tags", () => {
    expect(formatVersion("v1.2.3")).toBe("1.2.3");
    expect(formatVersion("1.2.3")).toBe("1.2.3");
    expect(formatVersion("batchwork@1.0.1", "batchwork")).toBe("1.0.1");
  });
});

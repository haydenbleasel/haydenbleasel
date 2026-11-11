import { describe, expect, test } from "bun:test";

import type { Appearance } from "./appearances";
import { appearances } from "./appearances";
import {
  formatEventDate,
  getUpcomingAppearances,
} from "./upcoming-appearances";

const source = appearances.find(
  (item) => item.title === "The Tech Week Flyover #SFTechWeek"
);
if (!source?.event || !source.url) {
  throw new Error("Flyover requires verified event dates and a URL");
}
const flyover = { ...source, event: source.event, url: source.url };

describe("upcoming appearances", () => {
  test("shows a scheduled event before and during it, then expires exactly at its end", () => {
    expect(
      getUpcomingAppearances([flyover], new Date("2026-09-28T00:00:00Z"))
    ).toEqual([flyover]);
    expect(
      getUpcomingAppearances([flyover], new Date("2026-10-09T22:59:59Z"))
    ).toEqual([flyover]);
    expect(
      getUpcomingAppearances([flyover], new Date("2026-10-09T23:00:00Z"))
    ).toEqual([]);
  });

  test("does not infer dates for year-only entries or feature incomplete events", () => {
    const invalid: Appearance[] = [
      { title: "Year only", type: "Talk", year: 2027 },
      { ...flyover, url: undefined },
      { ...flyover, event: { ...flyover.event, startDate: "unknown" } },
      {
        ...flyover,
        event: { ...flyover.event, endDate: "2026-10-08T00:00:00Z" },
      },
    ];
    expect(
      getUpcomingAppearances(invalid, new Date("2026-09-28T00:00:00Z"))
    ).toEqual([]);
  });

  test("orders by actual instants across timezones without reordering the archive", () => {
    const earlier = {
      ...flyover,
      event: { ...flyover.event, startDate: "2026-10-09T14:00:00-04:00" },
      title: "Earlier",
    };
    const input = [flyover, earlier];
    expect(
      getUpcomingAppearances(input, new Date("2026-09-28T00:00:00Z")).map(
        (item) => item.title
      )
    ).toEqual(["Earlier", flyover.title]);
    expect(input).toEqual([flyover, earlier]);
  });

  test("formats the organizer's timezone, including daylight saving time", () => {
    const label = formatEventDate(flyover.event);
    expect(label).toContain("Oct 9, 2026");
    expect(label).toContain("12:00");
    expect(label).toContain("4:00 PM PDT");
    const winter = formatEventDate({
      ...flyover.event,
      endDate: "2026-12-10T00:00:00Z",
      startDate: "2026-12-09T20:00:00Z",
    });
    expect(winter).toContain("12:00");
    expect(winter).toContain("4:00 PM PST");
  });

  test("renders no highlights when all events have passed", () => {
    expect(
      getUpcomingAppearances(appearances, new Date("2027-01-01T00:00:00Z"))
    ).toEqual([]);
  });
});

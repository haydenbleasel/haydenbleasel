import { describe, expect, test } from "bun:test";

import type { Appearance } from "../src/lib/appearances";
import { appearances } from "../src/lib/appearances";
import {
  formatEventDate,
  getUpcomingAppearances,
  hasScheduleChange,
} from "../src/lib/upcoming-appearances";

// Node's bundled ICU joins a date and time with a comma, while the system ICU
// Bun uses on macOS says "at".
const AT = "(?:,| at)";

// ICU's dash, and the space that keeps each time with its AM or PM.
const spacing = (label: string) => [
  label.match(/\s–\s/u)?.[0],
  label.match(/\d(?<gap>\s)[AP]M/u)?.groups?.gap,
];

const source = appearances.find(
  (item) => item.title === "The Tech Week Flyover #SFTechWeek"
);
if (!source?.event || !source.url) {
  throw new Error("Flyover requires verified event dates and a URL");
}
const flyover = { ...source, event: source.event, url: source.url };

const changedBetween = (since: string, now: string) =>
  hasScheduleChange([flyover], new Date(since), new Date(now));

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

  test("gives a multi-day event each end's date and time once", () => {
    const label = formatEventDate({
      ...flyover.event,
      endDate: "2026-10-11T16:00:00-07:00",
      startDate: "2026-10-09T12:00:00-07:00",
    });
    expect(label).not.toContain("/");
    expect(label).not.toContain(" · ");
    expect(label.match(/Oct 9, 2026/gu)).toHaveLength(1);
    expect(label).toMatch(new RegExp(`^Oct 9, 2026${AT} 12:00\\sPM PDT`, "u"));
    expect(label).toMatch(new RegExp(`Oct 11, 2026${AT} 4:00\\sPM PDT$`, "u"));
    // Days are counted in the organizer's timezone: this evening event ends
    // after midnight UTC but on the same local day, so it keeps the short form.
    const evening = formatEventDate({
      ...flyover.event,
      endDate: "2026-10-09T21:00:00-07:00",
      startDate: "2026-10-09T18:00:00-07:00",
    });
    expect(evening).toMatch(/^Oct 9, 2026 · 6:00\s–\s9:00\sPM PDT$/u);
  });

  test("keeps an evening that runs past midnight on its start date", () => {
    const midnight = formatEventDate({
      ...flyover.event,
      endDate: "2026-10-10T00:00:00-07:00",
      startDate: "2026-10-09T19:00:00-07:00",
    });
    expect(midnight).toMatch(/^Oct 9, 2026 · 7:00\sPM\s–\s12:00\sAM PDT$/u);
    const late = formatEventDate({
      ...flyover.event,
      endDate: "2026-10-10T01:30:00-07:00",
      startDate: "2026-10-09T22:00:00-07:00",
    });
    expect(late).toMatch(/^Oct 9, 2026 · 10:00\sPM\s–\s1:30\sAM PDT$/u);
    // Daylight saving ends overnight, so each time names its own zone.
    const fallBack = formatEventDate({
      ...flyover.event,
      endDate: "2026-11-01T01:30:00-08:00",
      startDate: "2026-10-31T22:00:00-07:00",
    });
    expect(fallBack).toMatch(
      /^Oct 31, 2026 · 10:00\sPM PDT\s–\s1:30\sAM PST$/u
    );
  });

  test("spaces an overnight range like a same-day one", () => {
    const sameDay = formatEventDate(flyover.event);
    const overnight = formatEventDate({
      ...flyover.event,
      endDate: "2026-10-10T01:30:00-07:00",
      startDate: "2026-10-09T22:00:00-07:00",
    });

    expect(spacing(overnight)).toEqual(spacing(sameDay));
  });

  test("gives both dates for an overnight event of 12 hours or more", () => {
    // A hackathon from 10 AM to 8 AM the next day.
    const hackathon = formatEventDate({
      ...flyover.event,
      endDate: "2026-10-11T08:00:00-07:00",
      startDate: "2026-10-10T10:00:00-07:00",
    });
    expect(hackathon).toMatch(
      new RegExp(
        `^Oct 10, 2026${AT} 10:00\\sAM PDT\\s–\\sOct 11, 2026${AT} 8:00\\sAM PDT$`,
        "u"
      )
    );
    const almostADay = formatEventDate({
      ...flyover.event,
      endDate: "2026-10-11T08:59:00-07:00",
      startDate: "2026-10-10T09:00:00-07:00",
    });
    expect(almostADay).toContain("Oct 11, 2026");
  });

  test("renders no highlights when all events have passed", () => {
    expect(
      getUpcomingAppearances(appearances, new Date("2027-01-01T00:00:00Z"))
    ).toEqual([]);
  });

  test("reports when an event started or ended in a window, for the scheduled rebuild", () => {
    // The Flyover runs from 19:00 to 23:00 UTC on Oct 9.
    expect(changedBetween("2026-10-09T18:00:00Z", "2026-10-09T19:00:00Z")).toBe(
      true
    );
    expect(changedBetween("2026-10-09T22:30:00Z", "2026-10-09T23:30:00Z")).toBe(
      true
    );
    expect(changedBetween("2026-10-09T19:00:00Z", "2026-10-09T22:59:59Z")).toBe(
      false
    );
    expect(changedBetween("2026-10-10T00:00:00Z", "2026-10-10T02:00:00Z")).toBe(
      false
    );
    expect(
      hasScheduleChange(
        [{ title: "Year only", type: "Talk", year: 2026 }],
        new Date(0)
      )
    ).toBe(false);
  });
});

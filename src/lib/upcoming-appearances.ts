import type { Appearance } from "./appearances";

export type ScheduledAppearance = Appearance & {
  event: NonNullable<Appearance["event"]>;
  url: string;
};

// An event stays featured while it is happening and expires at its exact end
// time. The prerendered /speaking page calls this at build time, so
// upcoming-carousel.ts repeats the expiry in the browser.
export const getUpcomingAppearances = (
  items: Appearance[],
  now = new Date()
): ScheduledAppearance[] =>
  items
    .filter((item): item is ScheduledAppearance => {
      if (!item.event || !item.url) {
        return false;
      }
      const start = Date.parse(item.event.startDate);
      const end = Date.parse(item.event.endDate);
      return (
        Number.isFinite(start) &&
        Number.isFinite(end) &&
        end > start &&
        end > now.getTime()
      );
    })
    .toSorted(
      (a, b) => Date.parse(a.event.startDate) - Date.parse(b.event.startDate)
    );

// The prerendered /speaking page changes when an event starts ("Happening
// now") or ends (its card goes). The deploy workflow checks this every hour,
// over the past two hours to allow for late scheduled runs, and rebuilds the
// site when it's true, so visitors without JavaScript see the same as the
// carousel script shows.
export const hasScheduleChange = (
  items: Appearance[],
  since: Date,
  now = new Date()
) =>
  items.some(({ event }) =>
    [event?.startDate, event?.endDate].some((value) => {
      const time = Date.parse(value ?? "");
      return time > since.getTime() && time <= now.getTime();
    })
  );

const HALF_DAY = 12 * 60 * 60 * 1000;

export const formatEventDate = (event: ScheduledAppearance["event"]) => {
  const date = {
    day: "numeric",
    month: "short",
    timeZone: event.timeZone,
    year: "numeric",
  } as const;
  const time = {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timeZone,
    timeZoneName: "short",
  } as const;
  const day = new Intl.DateTimeFormat("en-US", date);
  const clock = new Intl.DateTimeFormat("en-US", time);
  const full = new Intl.DateTimeFormat("en-US", { ...date, ...time });
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  if (day.format(start) === day.format(end)) {
    return `${day.format(start)} · ${clock.formatRange(start, end)}`;
  }
  // Longer events, including an overnight hackathon from 10 AM to 8 AM that
  // would otherwise read as ending before it starts, give the date and time of
  // each end once.
  if (end.getTime() - start.getTime() >= HALF_DAY) {
    return full.formatRange(start, end);
  }
  // An evening that runs past midnight (under 12 hours, so from PM to AM)
  // keeps its start date and gives each time, naming the timezone once unless
  // daylight saving changes overnight. A time-only formatRange would fall back
  // to both full dates here, so this keeps the times and dash from the parts of
  // a full range, which spaces them like the same-day label.
  const parts = full.formatRangeToParts(start, end);
  const zone = (source: "endRange" | "startRange") =>
    parts.find((part) => part.source === source && part.type === "timeZoneName")
      ?.value;
  const sameZone = zone("startRange") === zone("endRange");
  const timeOf = (source: "endRange" | "startRange") => {
    const side = parts.filter((part) => part.source === source);
    return side
      .slice(side.findIndex((part) => part.type === "hour"))
      .filter(
        (part) =>
          source === "endRange" || !sameZone || part.type !== "timeZoneName"
      )
      .map((part) => part.value)
      .join("")
      .trimEnd();
  };
  const separator =
    parts.find((part) => part.source === "shared" && part.value.includes("–"))
      ?.value ?? " – ";
  return `${day.format(start)} · ${timeOf("startRange")}${separator}${timeOf("endRange")}`;
};

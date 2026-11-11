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

const DAY = 24 * 60 * 60 * 1000;

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
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  if (day.format(start) === day.format(end)) {
    return `${day.format(start)} · ${clock.formatRange(start, end)}`;
  }
  // A time-only range that spans days falls back to both full dates. An event
  // shorter than a day that runs past midnight keeps its start date and gives
  // each time instead, naming the timezone once unless daylight saving changes.
  if (end.getTime() - start.getTime() < DAY) {
    const zone = (value: Date) =>
      clock.formatToParts(value).find((part) => part.type === "timeZoneName")
        ?.value;
    const from =
      zone(start) === zone(end)
        ? new Intl.DateTimeFormat("en-US", {
            ...time,
            timeZoneName: undefined,
          }).format(start)
        : clock.format(start);
    return `${day.format(start)} · ${from} – ${clock.format(end)}`;
  }
  // Longer events give the date and time of each end once.
  return new Intl.DateTimeFormat("en-US", { ...date, ...time }).formatRange(
    start,
    end
  );
};

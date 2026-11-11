import type { Appearance } from "./appearances";

export type ScheduledAppearance = Appearance & {
  event: NonNullable<Appearance["event"]>;
  url: string;
};

// Evaluate for every request, not at module load or build time. An event stays
// featured while it is happening and expires at its exact end time.
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

export const formatEventDate = (event: ScheduledAppearance["event"]) => {
  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: event.timeZone,
    year: "numeric",
  });
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timeZone,
    timeZoneName: "short",
  });
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  return `${day.formatRange(start, end)} · ${time.formatRange(start, end)}`;
};

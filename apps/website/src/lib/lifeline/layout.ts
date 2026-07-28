import type { LifelineMarker } from "./types";

/** Width of the pinned Age/Years label column. */
export const LIFELINE_LABEL_COLUMN_WIDTH = 56;
export const LIFELINE_LABEL_GAP = 16;
export const LIFELINE_STICKY_SHIELD_WIDTH =
  LIFELINE_LABEL_COLUMN_WIDTH + LIFELINE_LABEL_GAP;
export const LIFELINE_STICKY_LEFT = 20;

/** Matches Tailwind's md: breakpoint so JS and CSS can never disagree. */
export const LIFELINE_MOBILE_BREAKPOINT = 768;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const hasMarkerContent = (marker: LifelineMarker) =>
  marker.events.length > 0 ||
  (marker.companies?.length ?? 0) > 0 ||
  (marker.mentors?.length ?? 0) > 0 ||
  (marker.met?.length ?? 0) > 0;

export const hasMarkerPeople = (marker: LifelineMarker) =>
  (marker.mentors?.length ?? 0) > 0 || (marker.met?.length ?? 0) > 0;

/** Estimated column width — also drives the intro sweep's pacing. */
export const getMarkerWidth = (marker: LifelineMarker, nextYear?: number) => {
  const hasContent = hasMarkerContent(marker);
  const hasPeople = hasMarkerPeople(marker);

  if (!nextYear) {
    return hasContent ? 360 : 80;
  }
  if (!hasContent) {
    return 80;
  }

  const peopleOnly =
    hasPeople &&
    marker.events.length === 0 &&
    (marker.companies?.length ?? 0) === 0;

  if (peopleOnly) {
    return 220;
  }

  const gap = Math.max(1, nextYear - marker.year);
  return Math.min(420, Math.max(290, gap * 36));
};

/** Estimated entry height for the vertical layout's intro pacing. */
export const getMarkerHeight = (marker: LifelineMarker, nextYear?: number) => {
  const hasContent = hasMarkerContent(marker);
  const hasPeople = hasMarkerPeople(marker);

  if (!hasContent) {
    return 48;
  }

  const peopleOnly =
    hasPeople &&
    marker.events.length === 0 &&
    (marker.companies?.length ?? 0) === 0;

  let height = 96;

  if (marker.companies?.length) {
    height += 28;
  }
  height += marker.events.length * 44;

  if (peopleOnly) {
    height += 88;
  } else if (hasPeople) {
    height += 108;
  }

  if (!nextYear) {
    return Math.min(520, Math.max(peopleOnly ? 148 : 188, height));
  }

  const gap = Math.max(1, nextYear - marker.year);
  height += Math.min(32, gap * 3);

  return Math.min(520, Math.max(peopleOnly ? 148 : 188, height));
};

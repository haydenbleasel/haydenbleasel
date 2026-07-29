/**
 * Pure timing math for the intro sweep, ported unchanged from the
 * original. The sweep spends LIFELINE_SLOW_TIME_RATIO of its run inside
 * the first LIFELINE_SLOW_YEARS markers, then accelerates — childhood
 * lingers, the recent past flies.
 */
import { clamp } from "./layout";

export const LIFELINE_LABELS_MS = 600;
export const LIFELINE_RAIL_MS = 3200;
/**
 * Track length the base rail duration was tuned for — roughly a 40-year
 * personal lifeline. Longer tracks slow the sweep sublinearly, capped so
 * a 250-year nation doesn't become a screensaver.
 */
export const LIFELINE_REFERENCE_TRACK = 9000;
export const LIFELINE_RAIL_MAX_MS = 7200;
export const LIFELINE_RAIL_SCALE_POWER = 0.45;
export const LIFELINE_FADE_SCALE_MAX = 1.5;

export const LIFELINE_SLOW_YEARS = 5;
export const LIFELINE_SLOW_TIME_RATIO = 0.38;
export const LIFELINE_SLOW_MARKER_FADE_MS = 720;
export const LIFELINE_FAST_MARKER_FADE_MS = 280;

const smoothstep = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const invertSmoothstep = (value: number) => {
  const target = clamp(value, 0, 1);
  let lo = 0;
  let hi = 1;

  for (let i = 0; i < 20; i += 1) {
    const mid = (lo + hi) / 2;
    if (smoothstep(mid) < target) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return (lo + hi) / 2;
};

const getSlowTrackPortion = (widths: number[]) => {
  const total = widths.reduce((sum, width) => sum + width, 0);
  if (total <= 0) {
    return 0;
  }
  const slow = widths
    .slice(0, LIFELINE_SLOW_YEARS)
    .reduce((sum, width) => sum + width, 0);
  return slow / total;
};

const getEasePower = (widths: number[]) => {
  const slowPortion = getSlowTrackPortion(widths);
  const softenedPivot = smoothstep(LIFELINE_SLOW_TIME_RATIO);

  if (slowPortion <= 0 || softenedPivot <= 0 || softenedPivot >= 1) {
    return 2.6;
  }

  return Math.log(slowPortion) / Math.log(softenedPivot);
};

export const trackProgressAtTime = (
  elapsedMs: number,
  widths: number[],
  railMs: number
) => {
  if (railMs <= 0) {
    return 0;
  }

  const t = smoothstep(elapsedMs / railMs);
  const power = getEasePower(widths);

  return clamp(t ** power, 0, 1);
};

export const timeAtTrackProgress = (
  progress: number,
  widths: number[],
  railMs: number
) => {
  const clamped = clamp(progress, 0, 1);
  if (clamped <= 0) {
    return 0;
  }
  if (clamped >= 1) {
    return railMs;
  }

  const power = getEasePower(widths);
  const softened = clamped ** (1 / power);

  return invertSmoothstep(softened) * railMs;
};

export const getRailDuration = (totalTrackWidth: number) => {
  if (totalTrackWidth <= LIFELINE_REFERENCE_TRACK) {
    return LIFELINE_RAIL_MS;
  }

  const scale =
    (totalTrackWidth / LIFELINE_REFERENCE_TRACK) ** LIFELINE_RAIL_SCALE_POWER;
  return Math.min(LIFELINE_RAIL_MAX_MS, Math.round(LIFELINE_RAIL_MS * scale));
};

export const getFadeScale = (railDuration: number) =>
  Math.min(LIFELINE_FADE_SCALE_MAX, railDuration / LIFELINE_RAIL_MS);

/** Slow markers linger in their fade; later ones snap in on a short ramp. */
export const getMarkerFadeDuration = (index: number) => {
  if (index < LIFELINE_SLOW_YEARS) {
    return LIFELINE_SLOW_MARKER_FADE_MS;
  }

  const rampYears = 3;
  const rampIndex = index - LIFELINE_SLOW_YEARS;
  if (rampIndex >= rampYears) {
    return LIFELINE_FAST_MARKER_FADE_MS;
  }

  const t = (rampIndex + 1) / rampYears;
  const blend = smoothstep(t);

  return Math.round(
    LIFELINE_SLOW_MARKER_FADE_MS +
      (LIFELINE_FAST_MARKER_FADE_MS - LIFELINE_SLOW_MARKER_FADE_MS) * blend
  );
};

/** Delay before marker `index` fades in, synced to the sweep's arrival. */
export const getMarkerDelay = (
  index: number,
  widths: number[],
  railDuration: number
) => {
  const total = widths.reduce((sum, width) => sum + width, 0);
  if (total <= 0) {
    return 0;
  }

  const offset = widths.slice(0, index).reduce((sum, width) => sum + width, 0);

  return timeAtTrackProgress(offset / total, widths, railDuration);
};

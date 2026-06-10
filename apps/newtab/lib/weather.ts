const [latitude, longitude] = process.env.WEATHER_COORDINATES?.split(",") ?? [];

export const location = {
  latitude: Number(latitude),
  longitude: Number(longitude),
  name: "San Francisco, CA",
  timeZone: "America/Los_Angeles",
};

export interface UvForecast {
  /** Peak UV index for the day, rounded for display. */
  peak: number;
  /** Window during which the UV index is at its peak band, in minutes-of-day. */
  range: { start: number; end: number } | null;
}

interface AirQualityResponse {
  hourly?: {
    time?: string[];
    uv_index?: number[];
  };
}

interface ForecastResponse {
  hourly?: {
    time?: string[];
    cloud_cover?: number[];
  };
}

/**
 * Cloud modification factor for UV. Open-Meteo's reported UV index is
 * effectively a clear-sky value, but clouds scatter and absorb UVB, so the UV
 * that reaches the ground is a fraction of that. This is the UV-adapted
 * Kasten–Czeplak relation: ~1 under clear skies, falling to ~0.44 (44% of
 * clear-sky UV) under full overcast — e.g. San Francisco's summer marine layer.
 */
const cloudModificationFactor = (cloudCoverPercent: number) => {
  const fraction = Math.min(Math.max(cloudCoverPercent / 100, 0), 1);
  return 1 - 0.56 * fraction ** 3.4;
};

/**
 * Rough estimate of how many minutes someone with light-to-medium (Fitzpatrick
 * II–III) skin needs in the sun to synthesise a day's worth of vitamin D at a
 * given UV index. Vitamin D production scales roughly with UV intensity, so the
 * time to a fixed dose is modelled as inversely proportional to the UV index,
 * calibrated to ~15 minutes at UV 9. Returns null when there's no meaningful UV.
 */
export const getVitaminDMinutes = (uvIndex: number): number | null => {
  if (uvIndex <= 0) {
    return null;
  }

  return Math.round(135 / uvIndex);
};

/** Snap a minutes-of-day value to the nearest quarter hour. */
const snapToQuarterHour = (value: number) => Math.round(value / 15) * 15;

/** Index of the largest value in a non-empty numeric series. */
const findPeakIndex = (values: number[]): number => {
  let peakIndex = 0;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] > values[peakIndex]) {
      peakIndex = i;
    }
  }
  return peakIndex;
};

/**
 * Walk outward from `peakIndex` in the `step` direction until the value drops
 * below `threshold`, then linearly interpolate the exact crossing time between
 * the two straddling samples. Returns the crossing in minutes-of-day.
 */
const findThresholdCrossing = (
  values: number[],
  minutes: number[],
  peakIndex: number,
  threshold: number,
  step: 1 | -1
): number => {
  let edge = minutes[peakIndex];
  for (
    let i = peakIndex;
    i + step >= 0 && i + step < values.length;
    i += step
  ) {
    const next = i + step;
    if (values[next] >= threshold) {
      edge = minutes[next];
      continue;
    }
    const fraction = (threshold - values[i]) / (values[next] - values[i]);
    edge = minutes[i] + fraction * (minutes[next] - minutes[i]);
    break;
  }
  return edge;
};

/**
 * Fetches today's hourly UV index for the configured location, attenuates it by
 * the forecast cloud cover (Open-Meteo's UV is otherwise a clear-sky value), and
 * derives the peak along with the window during which the UV sits at that peak
 * (i.e. rounds to the peak value). The window edges are linearly interpolated
 * between the hourly samples and snapped to the nearest 15 minutes. If the cloud
 * forecast is unavailable it falls back to the unattenuated clear-sky UV.
 */
export const getUvForecast = async (): Promise<UvForecast | null> => {
  const query = {
    forecast_days: "1",
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: location.timeZone,
  };
  const uvParams = new URLSearchParams({ ...query, hourly: "uv_index" });
  const cloudParams = new URLSearchParams({ ...query, hourly: "cloud_cover" });

  const [uvResponse, cloudResponse] = await Promise.all([
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${uvParams}`),
    fetch(`https://api.open-meteo.com/v1/forecast?${cloudParams}`).catch(
      () => null
    ),
  ]);

  if (!uvResponse.ok) {
    return null;
  }

  const data = (await uvResponse.json()) as AirQualityResponse;
  const times = data.hourly?.time ?? [];
  const clearSkyValues = data.hourly?.uv_index ?? [];

  if (times.length < 2 || times.length !== clearSkyValues.length) {
    return null;
  }

  // Match cloud cover to each UV sample by timestamp, then attenuate.
  const cloudByTime = new Map<string, number>();
  if (cloudResponse?.ok) {
    const cloudData = (await cloudResponse.json()) as ForecastResponse;
    const cloudTimes = cloudData.hourly?.time ?? [];
    const cloudValues = cloudData.hourly?.cloud_cover ?? [];
    for (const [i, time] of cloudTimes.entries()) {
      cloudByTime.set(time, cloudValues[i]);
    }
  }

  const values = clearSkyValues.map((uv, i) => {
    const cloud = cloudByTime.get(times[i]);
    return cloud === undefined ? uv : uv * cloudModificationFactor(cloud);
  });

  // Local wall-clock minutes-of-day for each sample (e.g. "...T13:00" -> 780).
  const minutes = times.map((time) => {
    const { hours, mins } =
      time.match(/T(?<hours>\d{2}):(?<mins>\d{2})/u)?.groups ?? {};
    return Number(hours) * 60 + Number(mins);
  });

  const peakIndex = findPeakIndex(values);
  const peak = Math.round(values[peakIndex]);

  if (peak <= 0) {
    return { peak: 0, range: null };
  }

  // Everything from `threshold` up rounds to the peak value. Walk out from the
  // peak in each direction to find where the UV crosses below it.
  const threshold = peak - 0.5;
  const start = findThresholdCrossing(
    values,
    minutes,
    peakIndex,
    threshold,
    -1
  );
  const end = findThresholdCrossing(values, minutes, peakIndex, threshold, 1);

  return {
    peak,
    range: { end: snapToQuarterHour(end), start: snapToQuarterHour(start) },
  };
};

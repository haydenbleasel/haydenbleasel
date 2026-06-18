const compactFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "always",
});

type RelativeTimeUnit = Parameters<Intl.RelativeTimeFormat["format"]>[1];

const relativeTimeUnits: {
  seconds: number;
  unit: RelativeTimeUnit;
}[] = [
  { seconds: 31_536_000, unit: "year" },
  { seconds: 2_592_000, unit: "month" },
  { seconds: 604_800, unit: "week" },
  { seconds: 86_400, unit: "day" },
  { seconds: 3600, unit: "hour" },
  { seconds: 60, unit: "minute" },
];
const fallbackRelativeTimeUnit = { seconds: 60, unit: "minute" } satisfies {
  seconds: number;
  unit: RelativeTimeUnit;
};

export const formatCompactNumber = (value: number) =>
  compactFormatter.format(value).replace(".0", "");

export const formatDate = (value: string) =>
  dateFormatter.format(new Date(value));

export const formatRelativeDate = (value: string, now = new Date()) => {
  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    return "Unknown";
  }

  const diffSeconds = (timestamp - now.getTime()) / 1000;
  const absoluteDiffSeconds = Math.abs(diffSeconds);

  if (absoluteDiffSeconds < 45) {
    return "now";
  }

  const relativeTimeUnit =
    relativeTimeUnits.find((item) => absoluteDiffSeconds >= item.seconds) ??
    fallbackRelativeTimeUnit;
  const { seconds, unit } = relativeTimeUnit;

  return relativeTimeFormatter.format(Math.round(diffSeconds / seconds), unit);
};

export const formatVersion = (value: string, packageName?: string) => {
  const packagePrefix = `${packageName?.toLowerCase()}@`;
  const withoutPackagePrefix =
    packageName && value.toLowerCase().startsWith(packagePrefix)
      ? value.slice(packageName.length + 1)
      : value;

  return withoutPackagePrefix.replace(/^v/iu, "");
};

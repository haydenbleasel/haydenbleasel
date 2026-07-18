const compactFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
});

export const formatCompactNumber = (value: number) =>
  compactFormatter.format(value).replace(".0", "");

// Bucket a series of daily values into a fixed number of points for a sparkline.
export const toSparklinePoints = (values: number[], bucketCount = 24) => {
  if (values.length === 0) {
    return [];
  }

  const bucketSize = Math.ceil(values.length / bucketCount);
  const points: number[] = [];

  for (let index = 0; index < values.length; index += bucketSize) {
    const bucket = values.slice(index, index + bucketSize);
    let total = 0;

    for (const value of bucket) {
      total += value;
    }

    points.push(total);
  }

  return points;
};

// Build an SVG path string for a sparkline within an 84x24 viewBox.
export const getSparklinePath = (points: number[]) => {
  if (points.length < 2) {
    return "";
  }

  const width = 84;
  const height = 24;
  const padding = 2;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = padding + (index / (points.length - 1)) * (width - padding * 2);
      const y =
        height - padding - ((point - min) / range) * (height - padding * 2);
      const command = index === 0 ? "M" : "L";

      return `${command}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
};

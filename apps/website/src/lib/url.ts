export const buildUrl = (
  nodeEnv = process.env.NODE_ENV,
  productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
) => {
  const protocol = nodeEnv === "production" ? "https" : "http";
  const origin = productionUrl ?? "localhost:3010";

  return `${protocol}://${origin}`;
};

export const url = buildUrl();

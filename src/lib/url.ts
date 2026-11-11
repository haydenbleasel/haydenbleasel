export const buildUrl = (
  nodeEnv = process.env.NODE_ENV,
  productionUrl = process.env.SITE_ORIGIN ?? "haydenbleasel.com"
) => {
  if (/^https?:\/\//u.test(productionUrl)) {
    return productionUrl.replace(/\/+$/u, "");
  }
  const protocol = nodeEnv === "production" ? "https" : "http";
  const origin = productionUrl ?? "localhost:3010";

  return `${protocol}://${origin}`;
};

export const url = buildUrl();

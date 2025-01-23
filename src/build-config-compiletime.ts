const { NODE_ENV, BACKEND_URL, STREAMING_URL, SENTRY_DSN, IMGIX_DOMAIN } =
  process.env;

const sanitizeURL = (url: string = ""): string => {
  try {
    return new URL(url).href;
  } catch {
    return "";
  }
};

const env = {
  NODE_ENV: NODE_ENV || "development",
  BACKEND_URL: sanitizeURL(BACKEND_URL),
  STREAMING_URL: sanitizeURL(STREAMING_URL),
  SENTRY_DSN: SENTRY_DSN,
  IMGIX_DOMAIN: IMGIX_DOMAIN || "",
};

export type ApolloEnv = typeof env;

export default () => ({
  data: env,
});

const { NODE_ENV, VITE_BACKEND_URL, VITE_STREAMING_URL, SENTRY_DSN } =
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
  BACKEND_URL: sanitizeURL(VITE_BACKEND_URL),
  STREAMING_URL: sanitizeURL(VITE_STREAMING_URL),
  SENTRY_DSN: SENTRY_DSN,
};

export type ApolloEnv = typeof env;

export default () => ({
  data: env,
});

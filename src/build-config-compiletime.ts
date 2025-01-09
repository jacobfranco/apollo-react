const { NODE_ENV, BACKEND_URL, SENTRY_DSN } = process.env;

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
  SENTRY_DSN,
};

export type ApolloEnv = typeof env;

export default () => ({
  data: env,
});

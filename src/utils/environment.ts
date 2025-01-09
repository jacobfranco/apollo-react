// src/utils/environment.ts
// This runs at runtime
const sanitizeURL = (url: string = ""): string => {
  try {
    return new URL(url).href;
  } catch {
    return "";
  }
};

export const getRuntimeConfig = () => {
  return {
    NODE_ENV: import.meta.env.MODE || "development",
    BACKEND_URL: sanitizeURL(import.meta.env.VITE_BACKEND_URL),
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  };
};

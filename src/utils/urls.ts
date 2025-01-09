import { getRuntimeConfig } from "./environment";

export const toWebSocket = (url: string): string => {
  if (url === "/api") {
    // In production
    return `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
      window.location.host
    }`;
  }
  // In development
  return url.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
};

const config = getRuntimeConfig();

export const urls = {
  BACKEND_URL: config.BACKEND_URL,
  STREAMING_URL: toWebSocket(config.BACKEND_URL),
};

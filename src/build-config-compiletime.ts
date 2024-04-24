import trim from 'lodash/trim.js';
import trimEnd from 'lodash/trimEnd.js';

const {
  NODE_ENV,
  VITE_BACKEND_URL,
  FE_SUBDIRECTORY,
  FE_INSTANCE_SOURCE_DIR,
  SENTRY_DSN,
} = process.env;

console.log('BACKEND_URL from process.env:', VITE_BACKEND_URL)

const sanitizeURL = (url: string | undefined = ''): string => {
  try {
    return trimEnd(new URL(url).toString(), '/');
  } catch {
    return '';
  }
};

const sanitizeBasename = (path: string | undefined = ''): string => {
  return `/${trim(path, '/')}`;
};

const env = {
  NODE_ENV: NODE_ENV || 'development',
  BACKEND_URL: sanitizeURL(VITE_BACKEND_URL),
  FE_SUBDIRECTORY: sanitizeBasename(FE_SUBDIRECTORY),
  FE_INSTANCE_SOURCE_DIR: FE_INSTANCE_SOURCE_DIR || 'instance',
  SENTRY_DSN,
};

export type ApolloEnv = typeof env;

export default () => ({
  data: env,
});
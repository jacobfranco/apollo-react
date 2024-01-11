import type { ApolloEnv } from './build-config-compiletime';

export const {
  NODE_ENV,
  BACKEND_URL,
  FE_SUBDIRECTORY,
  FE_INSTANCE_SOURCE_DIR,
  SENTRY_DSN,
} = import.meta.compileTime<ApolloEnv>('./build-config-compiletime.ts');
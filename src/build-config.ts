import type { ApolloEnv } from "./build-config-compiletime.ts";

export const { NODE_ENV, BACKEND_URL, STREAMING_URL, SENTRY_DSN } =
  import.meta.compileTime<ApolloEnv>("./build-config-compiletime.ts");

import { z } from "zod";

import { applicationSchema } from "src/schemas/application";
import { tokenSchema } from "src/schemas/token";

const authUserSchema = z.object({
  access_token: z.string(),
  id: z.string(),
  url: z.string().url(),
});

const authAppSchema = applicationSchema.and(
  z.object({
    access_token: z.string().optional().catch(undefined),
  })
);

const apolloAuthSchema = z.object({
  app: authAppSchema.optional(),
  tokens: z.record(z.string(), tokenSchema),
  users: z.record(z.string(), authUserSchema),
  me: z.string().url().optional(),
});

type AuthUser = z.infer<typeof authUserSchema>;
type ApolloAuth = z.infer<typeof apolloAuthSchema>;

export { apolloAuthSchema, type ApolloAuth, authUserSchema, type AuthUser };

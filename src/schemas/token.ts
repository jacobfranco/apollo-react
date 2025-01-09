import { z } from "zod";

const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string(),
  created_at: z.number(),
  id: z.coerce.string().optional().catch(undefined),
  me: z.string().url().optional().catch(undefined),
});

type Token = z.infer<typeof tokenSchema>;

export { tokenSchema, type Token };

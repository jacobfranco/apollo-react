import { z } from "zod";

export const broadcastSchema = z
  .object({
    externalId: z.string(),
    languageId: z.number(),
  })
  .passthrough(); // Allows additional unspecified fields

export type Broadcast = z.infer<typeof broadcastSchema>;

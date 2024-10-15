import { z } from 'zod';

export const broadcastSchema = z.object({
  externalId: z.string(),
  languageId: z.number(),
});

export type Broadcast = z.infer<typeof broadcastSchema>;

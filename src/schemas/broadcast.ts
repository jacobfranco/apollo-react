import { z } from 'zod';

export const BroadcastSchema = z.object({
  externalId: z.string(),
  languageId: z.number(),
});

export type Broadcast = z.infer<typeof BroadcastSchema>;

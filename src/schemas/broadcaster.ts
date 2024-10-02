import { z } from 'zod';
import { BroadcastSchema } from './broadcast';

export const BroadcasterSchema = z.object({
  broadcasterId: z.number(),
  broadcasterName: z.string().nullable().optional(),       // Adjusted to be optional and nullable
  broadcasterExternalId: z.string().nullable().optional(), // Adjusted to be optional and nullable
  broadcasterPlatformId: z.number(),
  broadcasterDefaultLanguageId: z.number(),
  broadcasts: z.array(BroadcastSchema),
  official: z.boolean(),
});

export type Broadcaster = z.infer<typeof BroadcasterSchema>;

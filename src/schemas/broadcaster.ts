import { z } from 'zod';
import { broadcastSchema } from './broadcast';

export const broadcasterSchema = z.object({
  broadcasterId: z.number(),
  broadcasterName: z.string().nullable().optional(),       // Adjusted to be optional and nullable
  broadcasterExternalId: z.string().nullable().optional(), // Adjusted to be optional and nullable
  broadcasterPlatformId: z.number(),
  broadcasterDefaultLanguageId: z.number(),
  broadcasts: z.array(broadcastSchema),
  official: z.boolean(),
});

export type Broadcaster = z.infer<typeof broadcasterSchema>;

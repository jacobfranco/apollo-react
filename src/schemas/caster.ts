import { z } from 'zod';
import { streamingPlatformSchema } from './streaming-platform';
import { streamSchema } from './stream';
import { regionSchema } from './region';

export const casterSchema = z.object({
  id: z.number(),
  displayName: z.string().nullable().optional(), // Adjusted to accept null or undefined
  username: z.string().nullable().optional(),    // Adjusted to accept null or undefined
  gameId: z.number(),
  deletedAt: z.number().nullable().optional(),
  platform: streamingPlatformSchema.nullable().optional(),
  stream: streamSchema.nullable().optional(),
  region: regionSchema.nullable().optional(),
});

export type Caster = z.infer<typeof casterSchema>;

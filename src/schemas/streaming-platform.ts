import { z } from 'zod';
import { imageSchema } from './image';

export const streamingPlatformSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  images: z.array(imageSchema).optional().nullable(),
});

export type StreamingPlatform = z.infer<typeof streamingPlatformSchema>;

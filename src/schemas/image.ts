import { z } from 'zod';

export const ImageSchema = z.object({
  id: z.number(),
  type: z.string(),
  url: z.string().url(),
  thumbnail: z.string().url(),
  fallback: z.boolean(),
});

export type Image = z.infer<typeof ImageSchema>;

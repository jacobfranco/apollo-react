import { z } from 'zod';

export const PlatformSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type Platform = z.infer<typeof PlatformSchema>;

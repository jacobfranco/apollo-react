import { z } from 'zod';

export const platformSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type Platform = z.infer<typeof platformSchema>;

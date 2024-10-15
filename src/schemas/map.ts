import { z } from 'zod';

export const mapSchema = z.object({
  id: z.number(),
});

export type Map = z.infer<typeof mapSchema>;
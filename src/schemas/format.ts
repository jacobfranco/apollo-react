import { z } from 'zod';

export const formatSchema = z.object({
  bestOf: z.number(),
});

export type Format = z.infer<typeof formatSchema>;

import { z } from 'zod';

export const FormatSchema = z.object({
  bestOf: z.number(),
});

export type Format = z.infer<typeof FormatSchema>;

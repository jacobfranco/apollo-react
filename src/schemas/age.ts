import { z } from 'zod';

export const AgeSchema = z.object({
  precision: z.string(),
  years: z.number(),
});

export type Age = z.infer<typeof AgeSchema>;

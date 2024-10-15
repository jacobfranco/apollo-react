import { z } from 'zod';

export const ageSchema = z.object({
  precision: z.string(),
  years: z.number(),
});

export type Age = z.infer<typeof ageSchema>;

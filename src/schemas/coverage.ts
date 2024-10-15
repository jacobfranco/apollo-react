import { z } from 'zod';
import { coverageDataSchema } from './coverage-data';

export const coverageSchema = z.object({
  data: coverageDataSchema,
});

export type Coverage = z.infer<typeof coverageSchema>;

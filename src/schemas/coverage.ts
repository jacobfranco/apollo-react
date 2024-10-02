import { z } from 'zod';
import { CoverageDataSchema } from './coverage-data';

export const CoverageSchema = z.object({
  data: CoverageDataSchema,
});

export type Coverage = z.infer<typeof CoverageSchema>;

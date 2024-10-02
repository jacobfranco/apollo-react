import { z } from 'zod';
import { CoverageDetailSchema } from './coverage-detail';

export const CoverageDataSchema = z.object({
  live: z.object({
    api: CoverageDetailSchema,
    cv: CoverageDetailSchema,
    server: z.any().optional().nullable(), // Adjusted to be optional and nullable
  }),
  realtime: z.object({
    api: CoverageDetailSchema,
    cv: z.any().optional().nullable(), // Adjusted to be optional and nullable
    server: z.object({
      expectation: z.string(),
      fact: z.string(),
    }).optional().nullable(), // Adjusted to be optional and nullable
  }),
  postgame: z.object({
    api: CoverageDetailSchema,
    cv: z.any().optional().nullable(), // Adjusted to be optional and nullable
    server: z.object({
      expectation: z.string(),
      fact: z.string(),
    }).optional().nullable(), // Adjusted to be optional and nullable
  }),
});

export type CoverageData = z.infer<typeof CoverageDataSchema>;

import { z } from 'zod';
import { coverageDetailSchema } from './coverage-detail';

export const coverageDataSchema = z.object({
  live: z.object({
    api: coverageDetailSchema,
    cv: coverageDetailSchema,
    server: z.any().optional().nullable(), // Adjusted to be optional and nullable
  }),
  realtime: z.object({
    api: coverageDetailSchema,
    cv: z.any().optional().nullable(), // Adjusted to be optional and nullable
    server: z.object({
      expectation: z.string(),
      fact: z.string(),
    }).optional().nullable(), // Adjusted to be optional and nullable
  }),
  postgame: z.object({
    api: coverageDetailSchema,
    cv: z.any().optional().nullable(), // Adjusted to be optional and nullable
    server: z.object({
      expectation: z.string(),
      fact: z.string(),
    }).optional().nullable(), // Adjusted to be optional and nullable
  }),
});

export type CoverageData = z.infer<typeof coverageDataSchema>;

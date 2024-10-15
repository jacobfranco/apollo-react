import { z } from 'zod';

export const coverageDetailSchema = z.object({
  expectation: z
    .union([
      z.literal('unsupported'),
      z.literal('available'),
      z.literal('unavailable'),
      z.literal('pending'),
      z.literal('partial'),
    ])
    .nullable(),
  fact: z
    .union([
      z.literal('unsupported'),
      z.literal('available'),
      z.literal('unavailable'),
      z.literal('pending'),
      z.literal('partial'),
    ])
    .nullable(),
});

export type CoverageDetail = z.infer<typeof coverageDetailSchema>;

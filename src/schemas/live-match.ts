// src/schemas/live-match.ts

import { z } from 'zod';
import { ParticipantSchema } from './participant'; // Adjust the import path as necessary
import { CoverageSchema } from './coverage';
import { SeriesSchema } from './series';       // Assuming you have a schema for coverage

// Define LiveMatch schema
export const liveMatchSchema = z.object({
  id: z.number(),
  lifecycle: z.string(),
  order: z.number(),
  series: SeriesSchema,
  deletedAt: z.date().nullable(),
  participants: z.array(ParticipantSchema),
  coverage: CoverageSchema.optional().nullable(),
  resourceVersion: z.number(),
});

export type LiveMatch = z.infer<typeof liveMatchSchema>;

// schemas/series.ts

import { z } from 'zod';
import { ParticipantSchema } from './participant';
import { BracketPositionSchema } from './bracket-position';
import { CasterSchema } from './caster';
import { BroadcasterSchema } from './broadcaster';
import { CoverageSchema } from './coverage';
import { FormatSchema } from './format';

export const SeriesSchema = z.object({
  id: z.number(),
  title: z.string(),
  start: z.number(),
  end: z.number(),
  postponedFrom: z.number(),
  deletedAt: z.number(),
  lifecycle: z.enum(['upcoming', 'live', 'over', 'deleted', 'over-forfeited']),
  tier: z.number(),
  bestOf: z.number(),
  chainIds: z.array(z.number()).optional(),           // Adjusted to be optional
  streamed: z.boolean(),
  bracketPosition: BracketPositionSchema.optional().nullable(), // Adjusted to be optional and nullable
  participants: z.array(ParticipantSchema),
  tournament: z
    .object({
      id: z.number(),
    })
    .optional()
    .nullable(), // Adjusted to be optional and nullable
  substage: z
    .object({
      id: z.number(),
    })
    .optional()
    .nullable(), // Adjusted to be optional and nullable
  game: z
    .object({
      id: z.number(),
    })
    .optional()
    .nullable(), // Adjusted to be optional and nullable
  matchIds: z.array(z.number()).optional(),             // Adjusted to be optional
  casters: z.array(CasterSchema).optional(),            // Adjusted to be optional
  broadcasters: z.array(BroadcasterSchema).optional(),  // Adjusted to be optional
  hasIncidentReport: z.boolean().optional(),
  coverage: CoverageSchema.optional(),                  // Adjusted to be optional
  format: FormatSchema.optional().nullable(),           // Adjusted to be optional and nullable
  gameVersion: z.string().nullable().optional(),        // Adjusted to be optional and nullable
  resourceVersion: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type Series = z.infer<typeof SeriesSchema>;

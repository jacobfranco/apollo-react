import { z } from 'zod';
import { coverageSchema } from './coverage';
import { formatSchema } from './format';

export const substageSchema = z.object({
  id: z.number(),
  stageId: z.number(),
  title: z.string(),
  tier: z.number(),
  type: z.number(),
  phase: z.string(),
  defaultSeriesFormat: formatSchema.optional().nullable(),
  gameId: z.number(),
  tournamentId: z.number(),
  order: z.number(),
  rosterIds: z.array(z.number()).optional().nullable(),
  start: z.number(),
  deletedAt: z.number().optional().nullable(),
  standings: z
    .array(
      z.object({
        rosterId: z.number(),
        points: z.number(),
        wins: z.number(),
        draws: z.number(),
        losses: z.number(),
        matchDiff: z.number(),
        scoreDiff: z.number(),
      })
    )
    .optional()
    .nullable(),
  rules: z
    .object({
      advance: z
        .object({
          number: z.number(),
          substageId: z.number().optional().nullable(),
        })
        .optional()
        .nullable(),
      descend: z
        .object({
          number: z.number(),
          substageId: z.number().optional().nullable(),
        })
        .optional()
        .nullable(),
      points: z
        .object({
          win: z.number(),
          draw: z.number(),
          loss: z.number(),
          scope: z.string(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  defaults: z
    .object({
      gameVersion: z.string().nullable().optional(),
      seriesFormat: formatSchema.optional().nullable(),
    })
    .optional()
    .nullable(),
  format: z
    .object({
      points: z
        .object({
          win: z.number(),
          draw: z.number(),
          loss: z.number(),
          scope: z.string(),
        })
        .optional()
        .nullable(),
      movements: z
        .array(
          z.object({
            position: z.number(),
            substageId: z.number(),
            type: z.string(),
          })
        )
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  coverage: coverageSchema.optional().nullable(),
  resourceVersion: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type Substage = z.infer<typeof substageSchema>;

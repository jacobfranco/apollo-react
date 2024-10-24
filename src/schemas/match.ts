import { z } from 'zod';
import { participantSchema } from './participant';
import { coverageSchema } from './coverage';
import { mapSchema } from './map';
import { gameSchema } from './game';
import { dateStringOrNumber } from 'src/utils/dates'

export const matchSchema = z.object({
  id: z.number(),
  map: mapSchema,
  lifecycle: z.enum(['upcoming', 'live', 'over', 'deleted', 'over-forfeited']),
  order: z.number(),
  series: z.object({ id: z.number() }).passthrough(), // Adjusted series schema
  deletedAt: dateStringOrNumber,
  game: gameSchema,
  participants: z.array(participantSchema),
  winner: z.boolean().optional(),
  stats: z.any().optional().nullable(),
  coverage: coverageSchema.optional().nullable(),
  resourceVersion: z.number(),
}).passthrough();

export type Match = z.infer<typeof matchSchema>;
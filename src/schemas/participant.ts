import { z } from 'zod';
import { RosterSchema } from './roster';

export const ParticipantSchema = z.object({
  seed: z.number(),
  score: z.number(),
  forfeit: z.boolean(),
  roster: RosterSchema,
  winner: z.boolean(),
  stats: z.any().optional().nullable(), // Adjusted to be optional and nullable
});

export type Participant = z.infer<typeof ParticipantSchema>;

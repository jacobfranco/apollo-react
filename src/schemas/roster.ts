import { z } from 'zod';
import { teamSchema } from './team';
import { playerSchema } from './player';

export const rosterSchema = z.object({
  id: z.number(),
  teamId: z.number(),
  playerIds: z.array(z.number()).optional(), // Adjusted to be optional
  gameId: z.number(),
  team: teamSchema.nullable(), // Results from improper JSON response I think -- TODO: Investigate
  players: z.array(playerSchema).optional(), // Adjusted to be optional
});

export type Roster = z.infer<typeof rosterSchema>;

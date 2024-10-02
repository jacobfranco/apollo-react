import { z } from 'zod';
import { TeamSchema } from './team';
import { PlayerSchema } from './player';

export const RosterSchema = z.object({
  id: z.number(),
  teamId: z.number(),
  playerIds: z.array(z.number()).optional(), // Adjusted to be optional
  gameId: z.number(),
  team: TeamSchema,
  players: z.array(PlayerSchema).optional(), // Adjusted to be optional
});

export type Roster = z.infer<typeof RosterSchema>;

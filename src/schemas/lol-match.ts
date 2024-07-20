import z from 'zod'
import { lolTeamSchema } from './lol-team' 

// Define LolMatch schema
export const lolMatchSchema = z.object({
  id: z.number(),
  team1: lolTeamSchema,
  team2: lolTeamSchema,
  seriesInfo: z.string(),
  matchNumber: z.string(),
  leadingTeam: z.string(),
  leadingScore: z.string(),
});

export type LolMatch = z.infer<typeof lolMatchSchema>;
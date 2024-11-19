import { z } from "zod";

export const playerAggStatsSchema = z.object({
  matches: z.number(),
  wins: z.number(),
  losses: z.number(),
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  cs: z.number(),
});

export type PlayerAggStats = z.infer<typeof playerAggStatsSchema>;

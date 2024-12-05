import { z } from "zod";

export const playerAggStatsSchema = z.object({
  id: z.number(),
  totalMatches: z.number(),
  totalKills: z.number(),
  totalDeaths: z.number(),
  totalAssists: z.number(),
  averageKills: z.number(),
  averageDeaths: z.number(),
  averageAssists: z.number(),
  totalCreepScore: z.number(),
  averageCreepScore: z.number(),
});

export type PlayerAggStats = z.infer<typeof playerAggStatsSchema>;

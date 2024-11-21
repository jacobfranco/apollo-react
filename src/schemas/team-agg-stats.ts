import { z } from "zod";

export const teamAggStatsSchema = z.object({
  totalMatches: z.number(),
  totalWins: z.number(),
  totalLosses: z.number(),
  totalScore: z.number(),
  totalGoldEarned: z.number(),
  totalTurretsDestroyed: z.number(),
  totalInhibitorsDestroyed: z.number(),
  averageScore: z.number(),
  averageGoldEarned: z.number(),
  averageTurretsDestroyed: z.number(),
  averageInhibitorsDestroyed: z.number(),
  currentWinStreak: z.number(),
  totalDragonKills: z.number(),
  totalBaronKills: z.number(),
  totalHeraldKills: z.number(),
  totalVoidGrubKills: z.number(),
  averageDragonKills: z.number(),
  averageBaronKills: z.number(),
  averageHeraldKills: z.number(),
  averageVoidGrubKills: z.number(),
  totalSeries: z.number(),
  totalSeriesWins: z.number(),
  totalSeriesLosses: z.number(),
});

export type TeamAggStats = z.infer<typeof teamAggStatsSchema>;

// src/schemas/team-match-stats.ts

import { z } from "zod";
import { creepsSchema, Creeps } from "./creeps";
import type { Team } from "./team"; // Type-only import
import { teamSchema } from "./team"; // For z.lazy()

// Define the interface
export interface TeamMatchStats {
  matchId?: number | null;
  start?: string | number | Date | null;
  opponent?: Team | null;
  score: number;
  isWinner: boolean;
  goldEarned: number;
  turretsDestroyed: number;
  inhibitorsDestroyed: number;
  faction: {
    factionName: string;
  };
  structures: {
    turrets: Record<string, { standing: boolean }>;
    inhibitors: Record<
      string,
      {
        standing: boolean;
        respawnTime: { milliseconds: number } | null;
      }
    >;
  };
  creeps: Creeps;
}

// Annotate the schema
export const teamMatchStatsSchema: z.ZodType<TeamMatchStats> = z.object({
  matchId: z.number().optional().nullable(),
  start: z.union([z.string(), z.number(), z.date()]).optional().nullable(),
  opponent: z
    .lazy(() => teamSchema)
    .optional()
    .nullable(),
  score: z.number(),
  isWinner: z.boolean(),
  goldEarned: z.number(),
  turretsDestroyed: z.number(),
  inhibitorsDestroyed: z.number(),
  faction: z.object({
    factionName: z.string(),
  }),
  structures: z.object({
    turrets: z.record(z.object({ standing: z.boolean() })),
    inhibitors: z.record(
      z.object({
        standing: z.boolean(),
        respawnTime: z
          .object({
            milliseconds: z.number(),
          })
          .nullable(),
      })
    ),
  }),
  creeps: creepsSchema,
});

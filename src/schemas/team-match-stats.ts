import { z } from "zod";

import { creepsSchema } from "./creeps";

export const teamMatchStatsSchema = z.object({
  score: z.number(),
  isWinner: z.boolean(),
  goldEarned: z.number(),
  turretsDestroyed: z.number(),
  inhibitorsDestroyed: z.number(),
  faction: z.object({
    factionName: z.string(),
  }),
  structures: z.object({
    turrets: z.object({
      topOuter: z.object({ standing: z.boolean() }),
      topInner: z.object({ standing: z.boolean() }),
      topInhibitor: z.object({ standing: z.boolean() }),
      topNexus: z.object({ standing: z.boolean() }),
      midOuter: z.object({ standing: z.boolean() }),
      midInner: z.object({ standing: z.boolean() }),
      midInhibitor: z.object({ standing: z.boolean() }),
      botOuter: z.object({ standing: z.boolean() }),
      botInner: z.object({ standing: z.boolean() }),
      botInhibitor: z.object({ standing: z.boolean() }),
      botNexus: z.object({ standing: z.boolean() }),
    }),
    inhibitors: z.object({
      top: z.object({
        standing: z.boolean(),
        respawnTime: z
          .object({
            milliseconds: z.number(),
          })
          .nullable(),
      }),
      mid: z.object({
        standing: z.boolean(),
        respawnTime: z
          .object({
            milliseconds: z.number(),
          })
          .nullable(),
      }),
      bot: z.object({
        standing: z.boolean(),
        respawnTime: z
          .object({
            milliseconds: z.number(),
          })
          .nullable(),
      }),
    }),
  }),
  creeps: creepsSchema,
});

export type TeamMatchStats = z.infer<typeof teamMatchStatsSchema>;

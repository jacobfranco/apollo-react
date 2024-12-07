import { z } from "zod";
import { teamSchema } from "./team";

export const playerMatchStatsSchema = z.object({
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  totalCreepScore: z.number(),
  neutralCreepScore: z.number(),
  champion: z
    .object({
      champ: z.object({
        id: z.number(),
        name: z.string(),
        game: z.object({
          id: z.number(),
        }),
        category: z.string(),
        subcategory: z.string().nullable(),
        externalId: z.string().nullable(),
        images: z.array(
          z.object({
            id: z.number(),
            type: z.string(),
            url: z.string(),
            thumbnail: z.string(),
            fallback: z.boolean(),
          })
        ),
      }),
    })
    .nullable(),
  items: z
    .array(
      z.object({
        item: z.object({
          id: z.number(),
          name: z.string(),
          game: z.object({
            id: z.number(),
          }),
          category: z.string(),
          subcategory: z.string().nullable(),
          externalId: z.string().nullable(),
          images: z.array(
            z.object({
              id: z.number(),
              type: z.string(),
              url: z.string(),
              thumbnail: z.string(),
              fallback: z.boolean(),
            })
          ),
        }),
        slot: z.number(),
      })
    )
    .optional(),
  trinketSlot: z
    .array(
      z.object({
        item: z.object({
          id: z.number(),
          name: z.string(),
          game: z.object({
            id: z.number(),
          }),
          category: z.string(),
          subcategory: z.string().nullable(),
          externalId: z.string().nullable(),
          images: z.array(
            z.object({
              id: z.number(),
              type: z.string(),
              url: z.string(),
              thumbnail: z.string(),
              fallback: z.boolean(),
            })
          ),
        }),
        slot: z.number(),
      })
    )
    .optional(),
  summonerSpells: z
    .array(
      z.object({
        spell: z.object({
          id: z.number(),
          name: z.string(),
          game: z.object({
            id: z.number(),
          }),
          category: z.string(),
          subcategory: z.string().nullable(),
          externalId: z.string().nullable(),
          images: z.array(
            z.object({
              id: z.number(),
              type: z.string(),
              url: z.string(),
              thumbnail: z.string(),
              fallback: z.boolean(),
            })
          ),
        }),
        slot: z.number(),
      })
    )
    .optional(),
  keystone: z
    .object({
      keystone: z.object({
        id: z.number(),
        name: z.string(),
        game: z.object({
          id: z.number(),
        }),
        category: z.string(),
        subcategory: z.string().nullable(),
        externalId: z.string().nullable(),
        images: z.array(
          z.object({
            id: z.number(),
            type: z.string(),
            url: z.string(),
            thumbnail: z.string(),
            fallback: z.boolean(),
          })
        ),
      }),
    })
    .optional()
    .nullable(),
  matchId: z.number(),
  start: z.union([z.string(), z.number(), z.date()]).optional().nullable(),
  opponent: z
    .lazy(() => teamSchema)
    .optional()
    .nullable(),
});

export type PlayerMatchStats = z.infer<typeof playerMatchStatsSchema>;

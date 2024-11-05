import { z } from "zod";
import { imageSchema } from "./image";
import { gameSchema } from "./game";

export const eliteSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  subcategory: z.string().nullable(),
  externalId: z.number().nullable(),
  game: gameSchema,
  images: z.array(imageSchema),
});

export type Elite = z.infer<typeof eliteSchema>;

export const creepsKillsSchema = z.object({
  kills: z.object({
    perEliteType: z
      .array(
        z.object({
          elite: eliteSchema,
          total: z.number(),
        })
      )
      .optional()
      .nullable(),
  }),
});

export type CreepsKills = z.infer<typeof creepsKillsSchema>;

export const creepsSchema = z.object({
  overall: creepsKillsSchema,
  neutrals: creepsKillsSchema,
});

export type Creeps = z.infer<typeof creepsSchema>;

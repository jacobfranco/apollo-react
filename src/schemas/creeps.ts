// src/schemas/creeps.ts

import { z } from "zod";
import { imageSchema } from "./image";
import { gameSchema } from "./game";

// Define interfaces
export interface Elite {
  id: number;
  name: string;
  category: string;
  subcategory: string | null;
  externalId: number | null;
  game: z.infer<typeof gameSchema>;
  images: z.infer<typeof imageSchema>[];
}

export interface CreepsKill {
  elite: Elite;
  total: number;
}

export interface CreepsKills {
  kills: {
    perEliteType?: CreepsKill[] | null;
  };
}

export interface Creeps {
  overall: CreepsKills;
  neutrals: CreepsKills;
}

// Annotate schemas with interfaces
export const eliteSchema: z.ZodType<Elite> = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  subcategory: z.string().nullable(),
  externalId: z.number().nullable(),
  game: gameSchema,
  images: z.array(imageSchema),
});

export const creepsKillSchema: z.ZodType<CreepsKill> = z.object({
  elite: eliteSchema,
  total: z.number(),
});

export const creepsKillsSchema: z.ZodType<CreepsKills> = z.object({
  kills: z.object({
    perEliteType: z.array(creepsKillSchema).optional().nullable(),
  }),
});

export const creepsSchema: z.ZodType<Creeps> = z.object({
  overall: creepsKillsSchema,
  neutrals: creepsKillsSchema,
});

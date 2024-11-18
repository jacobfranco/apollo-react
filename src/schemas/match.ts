import { z } from "zod";
import { participantSchema } from "./participant";
import { coverageSchema } from "./coverage";
import { mapSchema } from "./map";
import { gameSchema } from "./game";
import { dateStringOrNumber } from "src/utils/dates";
import { clockSchema } from "./clock";

export const matchSchema = z
  .object({
    id: z.number(),
    map: mapSchema,
    lifecycle: z.enum([
      "upcoming",
      "live",
      "over",
      "deleted",
      "over-forfeited",
    ]),
    order: z.number(),
    seriesId: z.number(),
    deletedAt: dateStringOrNumber,
    game: gameSchema,
    participants: z.array(participantSchema),
    winner: z.boolean().optional(),
    stats: z.any().optional().nullable(),
    coverage: coverageSchema.optional().nullable(),
    resourceVersion: z.number(),
    clock: clockSchema.nullable().optional(),
  })
  .passthrough();

export type Match = z.infer<typeof matchSchema>;

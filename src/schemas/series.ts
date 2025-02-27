import { z } from "zod";
import { participantSchema } from "./participant";
import { bracketPositionSchema } from "./bracket-position";
import { casterSchema } from "./caster";
import { broadcasterSchema } from "./broadcaster";
import { coverageSchema } from "./coverage";
import { formatSchema } from "./format";
import { tournamentSchema } from "./tournament";
import { substageSchema } from "./substage";
import { gameSchema } from "./game";

export const seriesSchema = z.object({
  id: z.number(),
  title: z.string(),
  start: z.number(),
  end: z.number(),
  postponedFrom: z.number(),
  deletedAt: z.number(),
  lifecycle: z.enum([
    "upcoming",
    "live",
    "over",
    "deleted",
    "over-forfeited",
    "over-draw",
  ]),
  tier: z.number(),
  bestOf: z.number(),
  chainIds: z.array(z.number()).optional(), // Adjusted to be optional
  streamed: z.boolean(),
  bracketPosition: bracketPositionSchema.optional().nullable(), // Adjusted to be optional and nullable
  participants: z.array(z.lazy(() => participantSchema)),
  tournament: tournamentSchema.optional(),
  substage: substageSchema.optional().nullable(),
  game: gameSchema,
  matchIds: z.array(z.number()).optional(), // Adjusted to be optional
  casters: z.array(casterSchema).optional(), // Adjusted to be optional
  broadcasters: z.array(broadcasterSchema).optional(), // Adjusted to be optional
  hasIncidentReport: z.boolean().optional(),
  coverage: coverageSchema.optional(), // Adjusted to be optional
  format: formatSchema.optional().nullable(), // Adjusted to be optional and nullable
  gameVersion: z.string().nullable().optional(), // Adjusted to be optional and nullable
  resourceVersion: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type Series = z.infer<typeof seriesSchema>;

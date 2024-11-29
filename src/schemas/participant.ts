import { z } from "zod";
import { rosterSchema } from "./roster";

export const participantSchema = z.object({
  seed: z.number(),
  score: z.number(),
  forfeit: z.boolean(),
  roster: z.lazy(() => rosterSchema).nullable(),
  winner: z.boolean(),
  stats: z.any().optional().nullable(), // Adjusted to be optional and nullable
});

export type Participant = z.infer<typeof participantSchema>;

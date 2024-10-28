import { z } from "zod";

export const clockSchema = z.object({
  milliseconds: z.number(),
});

export type Clock = z.infer<typeof clockSchema>;

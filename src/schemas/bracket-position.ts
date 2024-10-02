import { z } from 'zod';

export const BracketPositionSchema = z.object({
  part: z.string(),
  col: z.number(),
  offset: z.number(),
});

export type BracketPosition = z.infer<typeof BracketPositionSchema>;

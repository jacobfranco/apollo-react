import { z } from 'zod';

export const bracketPositionSchema = z.object({
  part: z.string(),
  col: z.number(),
  offset: z.number(),
});

export type BracketPosition = z.infer<typeof bracketPositionSchema>;

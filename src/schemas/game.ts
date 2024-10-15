import { z } from 'zod';

export const gameSchema = z.object({
  id: z.number(),
});

export type Game = z.infer<typeof gameSchema>;
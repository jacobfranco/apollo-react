import { z } from 'zod';

export const StandingRosterSchema = z.object({
  id: z.number(),
  from: z.number(),
  to: z.number(),
  rosterId: z.number(),
  deletedAt: z.number().optional(),
});

export type StandingRoster = z.infer<typeof StandingRosterSchema>;

import { z } from 'zod';

import { dateStringOrNumber } from 'src/utils/dates'

export const standingRosterSchema = z.object({
  id: z.number(),
  from: dateStringOrNumber,
  to: dateStringOrNumber,
  rosterId: z.number(),
  deletedAt: dateStringOrNumber,
});

export type StandingRoster = z.infer<typeof standingRosterSchema>;

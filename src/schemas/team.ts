import { z } from 'zod';
import { imageSchema } from './image';
import { regionSchema } from './region';
import { socialMediaAccountSchema } from './social-media-account';
import { standingRosterSchema } from './standing-roster';

import { dateStringOrNumber } from 'src/utils/dates'

export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string().optional(),
  alsoKnownAs: z.array(z.string()).optional(),
  deletedAt: dateStringOrNumber,
  active: z.boolean().optional(),
  images: z.array(imageSchema).optional(),
  region: regionSchema.optional().nullable(), // Adjusted to be optional and nullable
  socialMediaAccounts: z.array(socialMediaAccountSchema).optional(),
  standingRoster: standingRosterSchema.optional().nullable(), // Adjusted to be optional and nullable
  gameId: z.number().optional(),
  organizationId: z.number().optional(),
  resourceVersion: z.number().optional(),
  matchStats: z.any().optional().nullable(),
  lolSeasonStats: z.any().optional().nullable(),
});

export type Team = z.infer<typeof teamSchema>;

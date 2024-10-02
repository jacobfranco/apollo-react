import { z } from 'zod';
import { ImageSchema } from './image';
import { RegionSchema } from './region';
import { SocialMediaAccountSchema } from './social-media-account';
import { StandingRosterSchema } from './standing-roster';

export const TeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string().optional(),
  alsoKnownAs: z.array(z.string()).optional(),
  deletedAt: z.number().optional(),
  active: z.boolean().optional(),
  images: z.array(ImageSchema).optional(),
  region: RegionSchema.optional().nullable(), // Adjusted to be optional and nullable
  socialMediaAccounts: z.array(SocialMediaAccountSchema).optional(),
  standingRoster: StandingRosterSchema.optional().nullable(), // Adjusted to be optional and nullable
  gameId: z.number().optional(),
  organizationId: z.number().optional(),
  resourceVersion: z.number().optional(),
  matchStats: z.any().optional().nullable(),
  lolSeasonStats: z.any().optional().nullable(),
});

export type Team = z.infer<typeof TeamSchema>;

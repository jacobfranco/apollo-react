import { z } from 'zod';
import { ImageSchema } from './image';
import { RegionSchema } from './region';
import { AgeSchema } from './age';
import { SocialMediaAccountSchema } from './social-media-account';

export const PlayerSchema = z.object({
  id: z.number(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  nickName: z.string(),
  alsoKnownAs: z.array(z.string()).optional(),
  age: AgeSchema.optional(),
  deletedAt: z.number().optional(),
  active: z.boolean().optional(),
  images: z.array(ImageSchema).optional(),
  region: RegionSchema.optional().nullable(),
  gameId: z.number().optional(),
  raceId: z.number().optional(),
  role: z.string().optional(),
  teamIds: z.array(z.number()).optional(),
  socialMediaAccounts: z.array(SocialMediaAccountSchema).optional(),
  resourceVersion: z.number().optional(),
  lolStats: z.any().optional().nullable(),
  matchStats: z.any().optional().nullable(),
  lolSeasonStats: z.any().optional().nullable(),
});

export type Player = z.infer<typeof PlayerSchema>;

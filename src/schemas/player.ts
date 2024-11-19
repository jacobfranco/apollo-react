import { z } from "zod";
import { imageSchema } from "./image";
import { regionSchema } from "./region";
import { ageSchema } from "./age";
import { socialMediaAccountSchema } from "./social-media-account";

import { dateStringOrNumber } from "src/utils/dates";
import { playerMatchStatsSchema } from "./player-match-stats";
import { playerAggStatsSchema } from "./player-agg-stats";

export const playerSchema = z.object({
  id: z.number(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  nickName: z.string(),
  alsoKnownAs: z.array(z.string()).optional(),
  age: ageSchema.optional(),
  deletedAt: dateStringOrNumber,
  active: z.boolean().optional(),
  images: z.array(imageSchema).optional(),
  region: regionSchema.optional().nullable(),
  gameId: z.number().optional(),
  raceId: z.number().optional(),
  role: z.string().optional(),
  teamIds: z.array(z.number()).optional(),
  socialMediaAccounts: z.array(socialMediaAccountSchema).optional(),
  resourceVersion: z.number().optional(),
  lolStats: z.any().optional().nullable(),
  matchStats: playerMatchStatsSchema.optional().nullable(),
  lolSeasonStats: z.any().optional().nullable(),
  aggStats: playerAggStatsSchema.optional().nullable(),
});

export type Player = z.infer<typeof playerSchema>;

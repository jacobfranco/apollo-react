// src/schemas/team.ts

import { z } from "zod";
import { imageSchema } from "./image";
import { regionSchema } from "./region";
import { socialMediaAccountSchema } from "./social-media-account";
import { standingRosterSchema } from "./standing-roster";
import { dateStringOrNumber } from "src/utils/dates";
import type { TeamMatchStats } from "./team-match-stats"; // Type-only import
import { teamMatchStatsSchema } from "./team-match-stats";
import { teamAggStatsSchema } from "./team-agg-stats";

// Define the interface
export interface Team {
  id: number;
  name: string;
  abbreviation?: string;
  alsoKnownAs?: string[];
  deletedAt: z.infer<typeof dateStringOrNumber>;
  active?: boolean;
  images?: z.infer<typeof imageSchema>[];
  region?: z.infer<typeof regionSchema> | null;
  socialMediaAccounts?: z.infer<typeof socialMediaAccountSchema>[];
  standingRoster?: z.infer<typeof standingRosterSchema> | null;
  gameId?: number;
  organizationId?: number;
  resourceVersion?: number;
  matchStats?: TeamMatchStats | null;
  lolSeasonStats?: (TeamMatchStats | null)[] | null;
  aggStats?: z.infer<typeof teamAggStatsSchema> | null;
  league?: string;
}

// Annotate the schema
export const teamSchema: z.ZodType<Team> = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string().optional(),
  alsoKnownAs: z.array(z.string()).optional(),
  deletedAt: dateStringOrNumber,
  active: z.boolean().optional(),
  images: z.array(imageSchema).optional(),
  region: regionSchema.optional().nullable(),
  socialMediaAccounts: z.array(socialMediaAccountSchema).optional(),
  standingRoster: standingRosterSchema.optional().nullable(),
  gameId: z.number().optional(),
  organizationId: z.number().optional(),
  resourceVersion: z.number().optional(),
  matchStats: z
    .lazy(() => teamMatchStatsSchema)
    .optional()
    .nullable(),
  lolSeasonStats: z
    .array(z.lazy(() => teamMatchStatsSchema).nullable())
    .optional()
    .nullable(),
  aggStats: teamAggStatsSchema.optional().nullable(),
  league: z.string().optional(),
});

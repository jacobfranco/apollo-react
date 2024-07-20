import z from 'zod';

// Define LolTeam schema
export const lolTeamSchema = z.object({
  name: z.string(),
  kills: z.number(),
  gold: z.number(),
  towers: z.number(),
  logo: z.string(),
  record: z.string(),
  seed: z.number(),
});

// Define TypeScript types from schemas
export type LolTeam = z.infer<typeof lolTeamSchema>;


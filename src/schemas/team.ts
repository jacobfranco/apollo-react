import { z } from 'zod';

const teamSchema = z.object({
  name: z.string(),
  kills: z.number(),
  gold: z.number(),
  towers: z.number(),
  logo: z.string(),
  record: z.string(),
  seed: z.number(),
});

type Team = z.infer<typeof teamSchema>;

export { teamSchema, type Team };
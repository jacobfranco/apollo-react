import { z } from 'zod';

export const CasterSchema = z.object({
  primary: z.boolean(),
  casterId: z.number(),
});

export type Caster = z.infer<typeof CasterSchema>;

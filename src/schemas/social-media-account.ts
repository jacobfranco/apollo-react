import { z } from 'zod';
import { platformSchema } from './platform';

export const socialMediaAccountSchema = z.object({
  handle: z.string(),
  url: z.string().url(),
  platform: platformSchema,
});

export type SocialMediaAccount = z.infer<typeof socialMediaAccountSchema>;

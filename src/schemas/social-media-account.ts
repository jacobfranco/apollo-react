import { z } from 'zod';
import { PlatformSchema } from './platform';

export const SocialMediaAccountSchema = z.object({
  handle: z.string(),
  url: z.string().url(),
  platform: PlatformSchema,
});

export type SocialMediaAccount = z.infer<typeof SocialMediaAccountSchema>;

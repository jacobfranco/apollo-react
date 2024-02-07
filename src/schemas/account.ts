import z from 'zod';
import type { Resolve } from 'src/utils/types';
import { relationshipSchema } from './relationship';

const accountSchema = z.object({
    acct: z.string().catch(''),
    avatar: z.string(), // TODO: catch avatarMissing
    bio: z.string().optional(),
    bot: z.boolean().catch(false),
    created_at: z.string(),
    display_name: z.string(),
    followers_count: z.number(),
    following_count: z.number(),
    fqn: z.string().optional().catch(undefined),
    header: z.string(),
    id: z.string(),
    last_status_at: z.string().optional(),
    location: z.string().optional(),
    locked: z.boolean().catch(false),
    mute_expires_at: z.union([
      z.string(),
      z.null(),
    ]).catch(null),
    relationship: relationshipSchema.optional().catch(undefined),
    statusesCount: z.number(),
    url: z.string().optional(),
    username: z.string(),
    verified: z.boolean().catch(false),
  });

type Account = Resolve<z.infer<typeof accountSchema>>;

export { accountSchema, type Account };
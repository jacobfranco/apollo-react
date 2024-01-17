import z from 'zod';
import type { Resolve } from 'src/utils/types';

const accountSchema = z.object({
    avatar: z.string(), // catch avatarMissing
    bio: z.string().optional(),
    createdAt: z.string(),
    displayName: z.string(),
    followersCount: z.number(),
    followingCount: z.number(),
    header: z.string(),
    id: z.string(),
    lastStatusAt: z.string().optional(),
    location: z.string().optional(),
    statusesCount: z.number(),
    url: z.string().optional(),
    username: z.string(),
  });

type Account = Resolve<z.infer<typeof accountSchema>>;


export { accountSchema, type Account };
import { Resolve } from 'src/utils/types';
import { z } from 'zod';
import {accountSchema } from './account'
import { groupSchema } from './group';

// TODO: Implement schemas for content, group, attachment, mention, tag
const statusSchema = z.object({
  account: accountSchema, // Assuming accountSchema is defined elsewhere
  bookmarked: z.boolean(),
  // content: contentSchema, // Assuming contentSchema is defined elsewhere
  created_at: z.date(),
  liked: z.boolean(),
  likes_count: z.number(),
  group: groupSchema.nullable(), 
  in_reply_to_account_id: z.string().nullable(),
  in_reply_to_id: z.string().nullable(),
  id: z.string(),
  language: z.string().nullable(),
  // media_attachments: z.array(attachmentSchema), // Assuming attachmentSchema is defined elsewhere
  // mentions: z.array(mentionSchema), // Assuming mentionSchema is defined elsewhere
  muted: z.boolean(),
  pinned: z.boolean(),
  // poll: pollSchema.nullable(), // Assuming pollSchema is defined elsewhere
  quote: z.string().nullable(),
  quotes_count: z.number(),
  repost: z.boolean(),
  reposts_count: z.number(),
  replies_count: z.number(),
  sensitive: z.boolean(),
  spoiler_text: z.string(),
  // tags: z.array(tagSchema), // Assuming tagSchema is defined elsewhere
  uri: z.string().url(),
  url: z.string().url(),
  visibility: z.string().catch('public'),
});

type Status = Resolve<z.infer<typeof statusSchema>>;

export { statusSchema, type Status };
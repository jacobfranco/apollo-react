import { Resolve } from 'src/utils/types';
import { z } from 'zod';

import {accountSchema } from './account'
import { attachmentSchema } from './attachment';
import { cardSchema } from './card';
import { groupSchema } from './group';
import { mentionSchema } from './mention'
import { pollSchema } from './poll';
import { tagSchema } from './tag'
import { contentSchema, filteredArray } from './utils';
import { unescapeHTML } from 'src/utils/html';

const baseStatusSchema = z.object({
  account: accountSchema, 
  bookmarked: z.boolean(),
  card: cardSchema.nullable().catch(null),
  content: contentSchema, 
  created_at: z.date(),
  liked: z.boolean(),
  likes_count: z.number(),
  group: groupSchema.nullable(), 
  in_reply_to_account_id: z.string().nullable(),
  in_reply_to_id: z.string().nullable(),
  id: z.string(),
  language: z.string().nullable(),
  media_attachments: filteredArray(attachmentSchema),
  mentions: z.array(mentionSchema), 
  muted: z.boolean(),
  pinned: z.boolean(),
  poll: pollSchema.nullable(),
  quote: z.string().nullable(),
  quotes_count: z.number(),
  repost: z.boolean(),
  reposts_count: z.number(),
  replies_count: z.number(),
  sensitive: z.boolean(),
  spoiler_text: z.string(),
  tags: z.array(tagSchema), 
  uri: z.string().url(),
  url: z.string().url(),
  visibility: z.string().catch('public'),
});

type BaseStatus = z.infer<typeof baseStatusSchema>;
type TransformableStatus = Omit<BaseStatus, 'repost' | 'quote'>

/** Creates search index from the status. */
const buildSearchIndex = (status: TransformableStatus): string => {
  const pollOptionTitles = status.poll ? status.poll.options.map(({ title }) => title) : [];
  const mentionedUsernames = status.mentions.map(({ acct }) => `@${acct}`);

  const fields = [
    status.spoiler_text,
    status.content,
    ...pollOptionTitles,
    ...mentionedUsernames,
  ];

  const searchContent = unescapeHTML(fields.join('\n\n')) || '';
  return new DOMParser().parseFromString(searchContent, 'text/html').documentElement.textContent || '';
};

type Translation = {
  content: string;
  provider: string;
}

/** Add internal fields to the status. */
const transformStatus = <T extends TransformableStatus>({ ...status }: T) => {

  return {
    ...status,
    approval_status: 'approval' as const,
    expectsCard: false,
    filtered: [],
    hidden: false,
    search_index: buildSearchIndex(status),
    showFiltered: false, // TODO: this should be removed from the schema and done somewhere else
    translation: undefined as Translation | undefined,
  };
};

const embeddedStatusSchema = baseStatusSchema
  .transform(transformStatus)
  .nullable()
  .catch(null);

  const statusSchema = baseStatusSchema.extend({
    quote: embeddedStatusSchema,
    repost: embeddedStatusSchema,
  }).transform(transformStatus);  

  type Status = Resolve<z.infer<typeof statusSchema>>;

  export { statusSchema, type Status };
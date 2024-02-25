import escapeTextContentForBrowser from 'escape-html';
import { z } from 'zod';

import emojify from 'src/features/emoji';
import { stripCompatibilityFeatures, unescapeHTML } from 'src/utils/html';

import { accountSchema } from './account';
import { attachmentSchema } from './attachment';
import { cardSchema } from './card';
import { groupSchema } from './group';
import { mentionSchema } from './mention';
import { pollSchema } from './poll';
import { tagSchema } from './tag';
import { contentSchema, dateSchema, filteredArray } from './utils';

import type { Resolve } from 'src/utils/types';

const baseStatusSchema = z.object({
  account: accountSchema,
  application: z.object({
    name: z.string(),
    website: z.string().url().nullable().catch(null),
  }).nullable().catch(null),
  bookmarked: z.coerce.boolean(),
  card: cardSchema.nullable().catch(null),
  content: contentSchema,
  created_at: dateSchema,
  edited_at: z.string().datetime().nullable().catch(null),
  group: groupSchema.nullable().catch(null),
  in_reply_to_account_id: z.string().nullable().catch(null),
  in_reply_to_id: z.string().nullable().catch(null),
  id: z.string(),
  language: z.string().nullable().catch(null),
  liked: z.coerce.boolean(),
  likes_count: z.number().catch(0),
  media_attachments: filteredArray(attachmentSchema),
  mentions: filteredArray(mentionSchema),
  muted: z.coerce.boolean(),
  pinned: z.coerce.boolean(),
  poll: pollSchema.nullable().catch(null),
  quote: z.literal(null).catch(null),
  quotes_count: z.number().catch(0),
  repost: z.literal(null).catch(null),
  reposted: z.coerce.boolean(),
  reposts_count: z.number().catch(0),
  replies_count: z.number().catch(0),
  sensitive: z.coerce.boolean(),
  spoiler_text: contentSchema,
  tags: filteredArray(tagSchema),
  uri: z.string().url().catch(''),
  url: z.string().url().catch(''),
  visibility: z.string().catch('public'),
});

type BaseStatus = z.infer<typeof baseStatusSchema>;
type TransformableStatus = Omit<BaseStatus, 'reblog' | 'quote' >

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

  const contentHtml = stripCompatibilityFeatures(emojify(status.content));
  const spoilerHtml = emojify(escapeTextContentForBrowser(status.spoiler_text));

  return {
    ...status,
    approval_status: 'approval' as const,
    contentHtml,
    expectsCard: false,
    filtered: [],
    hidden: false,
    search_index: buildSearchIndex(status),
    showFiltered: false, // TODO: this should be removed from the schema and done somewhere else
    spoilerHtml,
    translation: undefined as Translation | undefined,
  };
};

const embeddedStatusSchema = baseStatusSchema
  .transform(transformStatus)
  .nullable()
  .catch(null);

const statusSchema = baseStatusSchema.extend({
  quote: embeddedStatusSchema,
  reblog: embeddedStatusSchema,
}).transform(({ ...status }) => {
  return {
    ...status,
    quote: status.quote || null,
  };
}).transform(transformStatus);

type Status = Resolve<z.infer<typeof statusSchema>>;

export { statusSchema, type Status };
import { z } from 'zod';

import { groupSchema } from './group';

/**
 * Card (aka link preview).
 * https://docs.joinmastodon.org/entities/card/
 */
const cardSchema = z.object({
  author_name: z.string().catch(''),
  author_url: z.string().url().catch(''),
  blurhash: z.string().nullable().catch(null),
  description: z.string().catch(''),
  embed_url: z.string().url().catch(''),
  group: groupSchema.nullable().catch(null), // TruthSocial
  height: z.number().catch(0),
  html: z.string().catch(''),
  image: z.string().nullable().catch(null),
  provider_name: z.string().catch(''),
  provider_url: z.string().url().catch(''),
  title: z.string().catch(''),
  type: z.enum(['link', 'photo', 'video', 'rich']).catch('link'),
  url: z.string().url(),
  width: z.number().catch(0),
})

type Card = z.infer<typeof cardSchema>;

export { cardSchema, type Card };
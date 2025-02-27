import DOMPurify from "isomorphic-dompurify";
import z from "zod";

import emojify from "src/features/emoji";
import { unescapeHTML } from "src/utils/html";

import { coerceObject, contentSchema, filteredArray } from "./utils";

import type { Resolve } from "src/utils/types";
import { relationshipSchema } from "./relationship";

import avatarMissing from "src/assets/images/avatar-missing.png";
import headerMissing from "src/assets/images/header-missing.png";

const birthdaySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const fieldSchema = z.object({
  name: z.string(),
  value: z.string(),
  verified_at: z.string().datetime().nullable().catch(null),
});

// TODO: Just make this all one object
const baseAccountSchema = z.object({
  accepts_chat_messages: z.boolean().catch(false),
  admin: z.boolean().catch(false),
  avatar: z.string().catch(avatarMissing),
  avatar_static: z.string().url().optional().catch(undefined),
  birthday: birthdaySchema.nullish().catch(undefined),
  bot: z.boolean().catch(false),
  chats_onboarded: z.boolean().catch(true),
  created_at: z.string().datetime().catch(new Date().toUTCString()),
  discoverable: z.boolean().catch(false),
  display_name: z.string().catch(""),
  fields: filteredArray(fieldSchema),
  followers_count: z.number().catch(0),
  following_count: z.number().catch(0),
  header: z.string().url().catch(headerMissing),
  header_static: z.string().url().optional().catch(undefined),
  id: z.string(),
  is_suggested: z.boolean().catch(false),
  last_status_at: z.string().datetime().optional().catch(undefined),
  location: z.string().optional().catch(undefined),
  locked: z.boolean().catch(false),
  moderator: z.boolean().catch(false),
  moved: z.literal(null).catch(null),
  mute_expires_at: z.union([z.string(), z.null()]).catch(null),
  note: contentSchema,
  relationship: relationshipSchema.optional().catch(undefined),
  statuses_count: z.number().catch(0),
  suspended: z.boolean().catch(false),
  tags: z.array(z.string()).catch([]),
  url: z.string().url(),
  username: z.string().catch(""),
  verified: z.boolean().catch(false),
  website: z.string().catch(""),
});

type BaseAccount = z.infer<typeof baseAccountSchema>;
type TransformableAccount = Omit<BaseAccount, "moved">;

/** Add internal fields to the account. */
const transformAccount = <T extends TransformableAccount>({
  fields,
  ...account
}: T) => {
  const newFields = fields.map((field) => ({
    ...field,
    value_emojified: emojify(field.value),
    value_plain: unescapeHTML(field.value),
  }));

  const displayName =
    account.display_name.trim().length === 0
      ? account.username
      : account.display_name;

  return {
    ...account,
    avatar_static: account.avatar_static || account.avatar,
    display_name: displayName,
    fields: newFields,
    header_static: account.header_static || account.header,
    note_emojified: DOMPurify.sanitize(emojify(account.note), {
      USE_PROFILES: { html: true },
    }),
    staff: account.admin || account.moderator,
  };
};

const accountSchema = baseAccountSchema
  .extend({
    moved: baseAccountSchema.transform(transformAccount).nullable().catch(null),
  })
  .transform(transformAccount);

type Account = Resolve<z.infer<typeof accountSchema>>;

export { accountSchema, type Account };

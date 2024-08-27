import escapeTextContentForBrowser from 'escape-html';
import z from 'zod';

import { groupRelationshipSchema } from './group-relationship';
import { groupTagSchema } from './group-tag';
import emojify from 'src/features/emoji';
import { unescapeHTML } from 'src/utils/html';

import avatarMissing from 'src/assets/images/avatar-missing.png';
import headerMissing from 'src/assets/images/header-missing.png';


const groupSchema = z.object({
  avatar: z.string().catch(avatarMissing),
  avatar_static: z.string().catch(''),
  created_at: z.string().datetime().catch(new Date().toUTCString()),
  deleted_at: z.string().datetime().or(z.null()).catch(null),
  display_name: z.string().catch(''),
  group_visibility: z.string().catch(''), // TruthSocial
  header: z.string().catch(headerMissing),
  header_static: z.string().catch(''),
  id: z.coerce.string(),
  locked: z.boolean().catch(false),
  membership_required: z.boolean().catch(false),
  members_count: z.number().catch(0),
  owner: z.object({ id: z.string() }),
  note: z.string().transform(note => note === '<p></p>' ? '' : note).catch(''),
  relationship: groupRelationshipSchema.nullable().catch(null), // Dummy field to be overwritten later
  slug: z.string().catch(''),
  source: z.object({
    note: z.string(),
  }).optional(), // TruthSocial
  statuses_visibility: z.string().catch('public'),
  tags: z.array(groupTagSchema).catch([]),
  uri: z.string().catch(''),
  url: z.string().catch(''),
}).transform(group => {
  group.avatar_static = group.avatar_static || group.avatar;
  group.header_static = group.header_static || group.header;
  group.locked = group.locked || group.group_visibility === 'members_only'; // TruthSocial

  return {
    ...group,
    display_name_html: emojify(escapeTextContentForBrowser(group.display_name)),
    note_emojified: emojify(group.note),
    note_plain: group.source?.note || unescapeHTML(group.note),
  };
});

type Group = z.infer<typeof groupSchema>;


export { groupSchema, type Group };
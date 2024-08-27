/**
 * Group normalizer:
 * Converts API groups into our internal format.
 */
import escapeTextContentForBrowser from 'escape-html';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import emojify from 'src/features/emoji';
import { normalizeEmoji } from 'src/normalizers/emoji';
import { unescapeHTML } from 'src/utils/html';
// import { makeEmojiMap } from 'src/utils/normalizers'; TODO: Maybe needed ?
import avatarMissing from 'src/assets/images/avatar-missing.png';
import headerMissing from 'src/assets/images/header-missing.png';



import type { Emoji, GroupRelationship } from 'src/types/entities';

export const GroupRecord = ImmutableRecord({
  avatar: '',
  avatar_static: '',
  created_at: '',
  deleted_at: null,
  display_name: '',
  emojis: [] as Emoji[],
  group_visibility: '',
  header: '',
  header_static: '',
  id: '',
  locked: false,
  membership_required: false,
  members_count: 0,
  owner: {
    id: '',
  },
  note: '',
  statuses_visibility: 'public',
  slug: '',
  tags: [],
  uri: '',
  url: '',

  // Internal fields
  display_name_html: '',
  note_emojified: '',
  note_plain: '',
  relationship: null as GroupRelationship | null,
});

/** Add avatar, if missing */
const normalizeAvatar = (group: ImmutableMap<string, any>) => {
  const avatar = group.get('avatar');
  const avatarStatic = group.get('avatar_static');
  const missing = avatarMissing;

  return group.withMutations(group => {
    group.set('avatar', avatar || avatarStatic || missing);
    group.set('avatar_static', avatarStatic || avatar || missing);
  });
};

/** Add header, if missing */
const normalizeHeader = (group: ImmutableMap<string, any>) => {
  const header = group.get('header');
  const headerStatic = group.get('header_static');
  const missing = headerMissing;

  return group.withMutations(group => {
    group.set('header', header || headerStatic || missing);
    group.set('header_static', headerStatic || header || missing);
  });
};

/** Normalize emojis */
const normalizeEmojis = (entity: ImmutableMap<string, any>) => {
  const emojis = entity.get('emojis', ImmutableList()).map(normalizeEmoji);
  return entity.set('emojis', emojis.toArray());
};

/** Set display name from username, if applicable */
const fixDisplayName = (group: ImmutableMap<string, any>) => {
  const displayName = group.get('display_name') || '';
  return group.set('display_name', displayName.trim().length === 0 ? group.get('username') : displayName);
};

/** Emojification, etc */
const addInternalFields = (group: ImmutableMap<string, any>) => {
  // const emojiMap = makeEmojiMap(group.get('emojis'));

  return group.withMutations((group: ImmutableMap<string, any>) => {
    // Emojify group properties
    group.merge({
      display_name_html: emojify(escapeTextContentForBrowser(group.get('display_name'))),
      note_emojified: emojify(group.get('note', '')),
      note_plain: unescapeHTML(group.get('note', '')),
    });

    // Emojify fields
    group.update('fields', ImmutableList(), fields => {
      return fields.map((field: ImmutableMap<string, any>) => {
        return field.merge({
          name_emojified: emojify(escapeTextContentForBrowser(field.get('name'))),
          value_emojified: emojify(field.get('value')),
          value_plain: unescapeHTML(field.get('value')),
        });
      });
    });
  });
};

const normalizeLocked = (group: ImmutableMap<string, any>) => {
  const locked = group.get('locked') || group.get('group_visibility') === 'members_only';
  return group.set('locked', locked);
};

/** Rewrite `<p></p>` to empty string. */
const fixNote = (group: ImmutableMap<string, any>) => {
  if (group.get('note') === '<p></p>') {
    return group.set('note', '');
  } else {
    return group;
  }
};

export const normalizeGroup = (group: Record<string, any>) => {
  return GroupRecord(
    ImmutableMap(fromJS(group)).withMutations(group => {
      normalizeEmojis(group);
      normalizeAvatar(group);
      normalizeHeader(group);
      normalizeLocked(group);
      fixDisplayName(group);
      fixNote(group);
      addInternalFields(group);
    }),
  );
};
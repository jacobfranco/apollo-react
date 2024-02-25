/**
 * Account normalizer:
 * Converts API accounts into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/account/}
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
// import { makeEmojiMap } from 'src/utils/normalizers';  TODO: Implement

// import type { PatronAccount } from 'src/reducers/patron';
import type { Emoji, /* Field,*/ EmbeddedEntity, Relationship } from 'src/types/entities'; // TODO: Implement fields

// https://docs.joinmastodon.org/entities/account/
export const AccountRecord = ImmutableRecord({
  accepts_chat_messages: false,
  acct: '',
  avatar: '',
  avatar_static: '',
  birthday: '',
  bot: false,
  chats_onboarded: true,
  created_at: '',
  discoverable: false,
  display_name: '',
  emojis: ImmutableList<Emoji>(),
  // fields: ImmutableList<Field>(),
  followers_count: 0,
  following_count: 0,
  fqn: '',
  header: '',
  header_static: '',
  id: '',
  last_status_at: '',
  location: '',
  locked: false,
  moved: null as EmbeddedEntity<any>,
  mute_expires_at: null as string | null,
  note: '',
  source: ImmutableMap<string, any>(),
  statuses_count: 0,
  uri: '',
  url: '',
  username: '',
  website: '',
  verified: false,

  // Internal fields
  admin: false,
  display_name_html: '',
  domain: '',
  moderator: false,
  note_emojified: '',
  note_plain: '',
  // patron: null as PatronAccount | null,
  relationship: null as Relationship | null,
  should_refetch: false,
  staff: false,
});

// https://docs.joinmastodon.org/entities/field/
export const FieldRecord = ImmutableRecord({
  name: '',
  value: '',
  verified_at: null as Date | null,

  // Internal fields
  name_emojified: '',
  value_emojified: '',
  value_plain: '',
});

/** Add avatar, if missing */
const normalizeAvatar = (account: ImmutableMap<string, any>) => {
  const avatar = account.get('avatar');
  const avatarStatic = account.get('avatar_static');
  const missing = require('src/assets/images/avatar-missing.png');

  return account.withMutations(account => {
    account.set('avatar', avatar || avatarStatic || missing);
    account.set('avatar_static', avatarStatic || avatar || missing);
  });
};

/** Add header, if missing */
const normalizeHeader = (account: ImmutableMap<string, any>) => {
  const header = account.get('header');
  const headerStatic = account.get('header_static');
  const missing = require('src/assets/images/header-missing.png');

  return account.withMutations(account => {
    account.set('header', header || headerStatic || missing);
    account.set('header_static', headerStatic || header || missing);
  });
};

/** Normalize custom fields */
const normalizeFields = (account: ImmutableMap<string, any>) => {
  return account.update('fields', ImmutableList(), fields => fields.map(FieldRecord));
};

/** Normalize emojis */
const normalizeEmojis = (entity: ImmutableMap<string, any>) => {
  const emojis = entity.get('emojis', ImmutableList()).map(normalizeEmoji);
  return entity.set('emojis', emojis);
};


/** Normalize Truth Social/Pleroma verified */
const normalizeVerified = (account: ImmutableMap<string, any>) => {
  return account.update('verified', verified => {
    return [
      verified === true,
    ].some(Boolean);
  });
};

/** Set username from acct, if applicable */
const fixUsername = (account: ImmutableMap<string, any>) => {
  const acct = account.get('acct') || '';
  const username = account.get('username') || '';
  return account.set('username', username || acct.split('@')[0]);
};

/** Set display name from username, if applicable */
const fixDisplayName = (account: ImmutableMap<string, any>) => {
  const displayName = account.get('display_name') || '';
  return account.set('display_name', displayName.trim().length === 0 ? account.get('username') : displayName);
};

/** Emojification, etc */
const addInternalFields = (account: ImmutableMap<string, any>) => {
  // const emojiMap = makeEmojiMap(account.get('emojis')); TODO: Implement

  return account.withMutations((account: ImmutableMap<string, any>) => {
    // Emojify account properties
    account.merge({
      display_name_html: emojify(escapeTextContentForBrowser(account.get('display_name'))),
      note_emojified: emojify(account.get('note', '')),
      note_plain: unescapeHTML(account.get('note', '')),
    });

    // Emojify fields
    account.update('fields', ImmutableList(), fields => {
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

const addStaffFields = (account: ImmutableMap<string, any>) => {
  const admin = account.getIn(['pleroma', 'is_admin']) === true;
  const moderator = account.getIn(['pleroma', 'is_moderator']) === true;
  const staff = admin || moderator;

  return account.merge({
    admin,
    moderator,
    staff,
  });
};

const normalizeDiscoverable = (account: ImmutableMap<string, any>) => {
  const discoverable = Boolean(account.get('discoverable') || account.getIn(['source', 'pleroma', 'discoverable']));
  return account.set('discoverable', discoverable);
};

/** Rewrite `<p></p>` to empty string. */
const fixNote = (account: ImmutableMap<string, any>) => {
  if (account.get('note') === '<p></p>') {
    return account.set('note', '');
  } else {
    return account;
  }
};

export const normalizeAccount = (account: Record<string, any>) => {
  return AccountRecord(
    ImmutableMap(fromJS(account)).withMutations(account => {
      normalizeEmojis(account);
      normalizeAvatar(account);
      normalizeHeader(account);
      normalizeFields(account);
      normalizeVerified(account);
      normalizeDiscoverable(account);
      addStaffFields(account);
      fixUsername(account);
      fixDisplayName(account);
      fixNote(account);
      addInternalFields(account);
    }),
  );
};
/**
 * Account normalizer:
 * Converts API accounts into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/account/}
 */
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from "immutable";

import emojify from "src/features/emoji";
import { normalizeEmoji } from "src/normalizers/emoji";
import { unescapeHTML } from "src/utils/html";
// import { makeEmojiMap } from 'src/utils/normalizers';  TODO: Implement
import avatarMissing from "src/assets/images/avatar-missing.png";
import headerMissing from "src/assets/images/header-missing.png";

// import type { PatronAccount } from 'src/reducers/patron';
import type {
  Emoji,
  Field,
  EmbeddedEntity,
  Relationship,
} from "src/types/entities";

// https://docs.joinmastodon.org/entities/account/
export const AccountRecord = ImmutableRecord({
  accepts_chat_messages: false,
  avatar: "",
  avatar_static: "",
  birthday: "",
  bot: false,
  chats_onboarded: true,
  created_at: "",
  discoverable: false,
  display_name: "",
  fields: ImmutableList<Field>(),
  followers_count: 0,
  following_count: 0,
  header: "",
  header_static: "",
  id: "",
  last_status_at: "",
  location: "",
  locked: false,
  moved: null as EmbeddedEntity<any>,
  mute_expires_at: null as string | null,
  note: "",
  statuses_count: 0,
  url: "",
  username: "",
  website: "",
  verified: false,
  admin: false,
  display_name_html: "",
  moderator: false,
  note_emojified: "",
  note_plain: "",
  // patron: null as PatronAccount | null,
  relationship: null as Relationship | null,
  should_refetch: false,
  staff: false,
});

// https://docs.joinmastodon.org/entities/field/
export const FieldRecord = ImmutableRecord({
  name: "",
  value: "",
  verified_at: null as Date | null,

  // Internal fields
  name_emojified: "",
  value_emojified: "",
  value_plain: "",
});

/** Add avatar, if missing */
const normalizeAvatar = (account: ImmutableMap<string, any>) => {
  const avatar = account.get("avatar");
  const avatarStatic = account.get("avatar_static");
  const missing = avatarMissing;

  return account.withMutations((account) => {
    account.set("avatar", avatar || avatarStatic || missing);
    account.set("avatar_static", avatarStatic || avatar || missing);
  });
};

/** Add header, if missing */
const normalizeHeader = (account: ImmutableMap<string, any>) => {
  const header = account.get("header");
  const headerStatic = account.get("header_static");
  const missing = headerMissing;

  return account.withMutations((account) => {
    account.set("header", header || headerStatic || missing);
    account.set("header_static", headerStatic || header || missing);
  });
};

/** Normalize custom fields */
const normalizeFields = (account: ImmutableMap<string, any>) => {
  return account.update("fields", ImmutableList(), (fields) =>
    fields.map(FieldRecord)
  );
};

/** Normalize emojis */
const normalizeEmojis = (entity: ImmutableMap<string, any>) => {
  const emojis = entity.get("emojis", ImmutableList()).map(normalizeEmoji);
  return entity.set("emojis", emojis);
};

/** Normalize Truth Social/Pleroma verified */
const normalizeVerified = (account: ImmutableMap<string, any>) => {
  return account.update("verified", (verified) => {
    return [verified === true].some(Boolean);
  });
};

/** Set display name from username, if applicable */
const fixDisplayName = (account: ImmutableMap<string, any>) => {
  const displayName = account.get("display_name") || "";
  return account.set(
    "display_name",
    displayName.trim().length === 0 ? account.get("username") : displayName
  );
};

const addStaffFields = (account: ImmutableMap<string, any>) => {
  const admin = account.get("admin") === true;
  const moderator = account.get("moderator") === true;
  const staff = admin || moderator;

  return account.merge({
    admin,
    moderator,
    staff,
  });
};

const normalizeDiscoverable = (account: ImmutableMap<string, any>) => {
  const discoverable = Boolean(account.get("discoverable"));
  return account.set("discoverable", discoverable);
};

/** Rewrite `<p></p>` to empty string. */
const fixNote = (account: ImmutableMap<string, any>) => {
  if (account.get("note") === "<p></p>") {
    return account.set("note", "");
  } else {
    return account;
  }
};

export const normalizeAccount = (account: Record<string, any>) => {
  return AccountRecord(
    ImmutableMap(fromJS(account)).withMutations((account) => {
      normalizeEmojis(account);
      normalizeAvatar(account);
      normalizeHeader(account);
      normalizeFields(account);
      normalizeVerified(account);
      normalizeDiscoverable(account);
      addStaffFields(account);
      fixDisplayName(account);
      fixNote(account);
    })
  );
};

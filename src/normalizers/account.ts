// TODO: Implement commented fields
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';


import type { EmbeddedEntity, Relationship } from 'src/types/entities';

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
  // emojis: ImmutableList<Emoji>(), 
  // favicon: '',
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

export const normalizeAccount = (account: Record<string, any>) => {
  return AccountRecord(
    ImmutableMap(fromJS(account)).withMutations(account => {
    }),
  );
};
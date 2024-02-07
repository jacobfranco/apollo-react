// TODO: Fix this 

import { accountSchema } from 'src/schemas';
import { 
    Map as ImmutableMap, 
    Record as ImmutableRecord,
    List as ImmutableList,
    fromJS } from 'immutable'

import type { Account, Attachment, Card, EmbeddedEntity, Group, Mention, Poll } from 'src/types/entities';
import { maybeFromJS } from 'src/utils/normalizers';

export type StatusApprovalStatus = 'pending' | 'approval' | 'rejected';
export type StatusVisibility = 'public' | 'unlisted' | 'private' | 'direct' | 'self' | 'group';

const parseAccount = (status: ImmutableMap<string, any>) => {
    try {
      const account = accountSchema.parse(maybeFromJS(status.get('account')));
      return status.set('account', account);
    } catch (_e) {
      return status.set('account', null);
    }
  };

export const StatusRecord = ImmutableRecord({
    account: null as unknown as Account,
    bookmarked: false,
    card: null as Card | null,
    content: '',
    created_at: '',
    dislikes_count: 0,
    disliked: false,
    edited_at: null as string | null,
    liked: false,
    likes_count: 0,
    filtered: ImmutableList<string>(),
    group: null as Group | null, 
    in_reply_to_account_id: null as string | null,
    in_reply_to_id: null as string | null,
    id: '',
    language: null as string | null,
    media_attachments: ImmutableList<Attachment>(), 
    mentions: ImmutableList<Mention>(), 
    muted: false,
    pinned: false,
    poll: null as EmbeddedEntity<Poll>,
    quote: null as EmbeddedEntity<any>,
    quotes_count: 0,
    // reactions: null as ImmutableList<EmojiReaction> | null,
    repost: null as EmbeddedEntity<any>,
    reposted: false,
    repost_count: 0,
    replies_count: 0,
    sensitive: false,
    spoiler_text: '',
    tags: ImmutableList<ImmutableMap<string, any>>(), 
    uri: '',
    url: '',
    visibility: 'public' as StatusVisibility, 
    zapped: false,
  
    // Internal fields
    contentHtml: '',
    expectsCard: false,
    hidden: false,
    search_index: '',
    showFiltered: true,
    spoilerHtml: '',
    translation: null as ImmutableMap<string, string> | null,
  });

export const normalizeStatus = (status: Record<string, any>) => {
    return StatusRecord(
      ImmutableMap(fromJS(status)).withMutations(status => { 
        parseAccount(status);
      }),
    );
  };
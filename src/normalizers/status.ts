/**
 * Status normalizer:
 * Converts API statuses into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/status/}
 */
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import { normalizeAttachment } from 'src/normalizers/attachment';
import { normalizeEmoji } from 'src/normalizers/emoji';
import { normalizeMention } from 'src/normalizers/mention';
import { accountSchema, cardSchema, emojiReactionSchema, groupSchema, pollSchema } from 'src/schemas';
import { filteredArray } from 'src/schemas/utils';
import { maybeFromJS } from 'src/utils/normalizers';

import type { Account, Attachment, Card, Emoji, Group, Mention, Poll, EmbeddedEntity, EmojiReaction } from 'src/types/entities';

export type StatusApprovalStatus = 'pending' | 'approval' | 'rejected';
export type StatusVisibility = 'public' | 'unlisted' | 'private' | 'direct' | 'self' | 'group';

// https://docs.joinmastodon.org/entities/status/
export const StatusRecord = ImmutableRecord({
  account: null as unknown as Account,
  application: null as ImmutableMap<string, any> | null,
  approval_status: 'approved' as StatusApprovalStatus,
  bookmarked: false,
  card: null as Card | null,
  content: '',
  created_at: '',
  edited_at: null as string | null,
  emojis: ImmutableList<Emoji>(),
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
  pleroma: ImmutableMap<string, any>(),
  ditto: ImmutableMap<string, any>(),
  poll: null as EmbeddedEntity<Poll>,
  quote: null as EmbeddedEntity<any>,
  quotes_count: 0,
  reactions: null as ImmutableList<EmojiReaction> | null,
  repost: null as EmbeddedEntity<any>,
  reposted: false,
  reposts_count: 0,
  replies_count: 0,
  zaps_amount: 0,
  sensitive: false,
  spaces: ImmutableList<ImmutableMap<string, any>>(),
  spoiler_text: '',
  tags: ImmutableList<ImmutableMap<string, any>>(),
  uri: '',
  url: '',
  visibility: 'public' as StatusVisibility,

  // Internal fields
  contentHtml: '',
  expectsCard: false,
  hidden: false,
  search_index: '',
  showFiltered: true,
  spoilerHtml: '',
  translation: null as ImmutableMap<string, string> | null,
});

const normalizeAttachments = (status: ImmutableMap<string, any>) => {
  return status.update('media_attachments', ImmutableList(), attachments => {
    return attachments.map(normalizeAttachment);
  });
};

const normalizeMentions = (status: ImmutableMap<string, any>) => {
  return status.update('mentions', ImmutableList(), mentions => {
    return mentions.map(normalizeMention);
  });
};

// Normalize the poll in the status, if applicable
const normalizeStatusPoll = (status: ImmutableMap<string, any>) => {
  try {
    const poll = pollSchema.parse(status.get('poll').toJS());
    return status.set('poll', poll);
  } catch (_e) {
    return status.set('poll', null);
  }
};

// Normalize card
const normalizeStatusCard = (status: ImmutableMap<string, any>) => {
  try {
    const card = cardSchema.parse(status.get('card').toJS());
    return status.set('card', card);
  } catch (e) {
    return status.set('card', null);
  }
};

// Fix order of mentions
const fixMentionsOrder = (status: ImmutableMap<string, any>) => {
  const mentions = status.get('mentions', ImmutableList());
  const inReplyToAccountId = status.get('in_reply_to_account_id');

  // Sort the replied-to mention to the top
  const sorted = mentions.sort((a: ImmutableMap<string, any>, _b: ImmutableMap<string, any>) => {
    if (a.get('id') === inReplyToAccountId) {
      return -1;
    } else {
      return 0;
    }
  });

  return status.set('mentions', sorted);
};

// Add self to mentions if it's a reply to self
const addSelfMention = (status: ImmutableMap<string, any>) => {
  const accountId = status.getIn(['account', 'id']);

  const isSelfReply = accountId === status.get('in_reply_to_account_id');
  const hasSelfMention = accountId === status.getIn(['mentions', 0, 'id']);

  if (isSelfReply && !hasSelfMention && accountId) {
    const mention = normalizeMention(status.get('account'));
    return status.update('mentions', ImmutableList(), mentions => (
      ImmutableList([mention]).concat(mentions)
    ));
  } else {
    return status;
  }
};

// Move the quote to the top-level
const fixQuote = (status: ImmutableMap<string, any>) => {
  return status.withMutations(status => {
    status.update('quote', quote => quote || status.getIn(['pleroma', 'quote']) || null);
    status.deleteIn(['pleroma', 'quote']);
    status.update('quotes_count', quotes_count => quotes_count || status.getIn(['pleroma', 'quotes_count'], 0));
    status.deleteIn(['pleroma', 'quotes_count']);
  });
};

/** If the status contains spoiler text, treat it as sensitive. */
const fixSensitivity = (status: ImmutableMap<string, any>) => {
  if (status.get('spoiler_text')) {
    status.set('sensitive', true);
  }
};

/** Normalize emojis. */
const normalizeEmojis = (status: ImmutableMap<string, any>) => {
  const data = ImmutableList<ImmutableMap<string, any>>(status.getIn(['pleroma', 'emoji_reactions']) || status.get('reactions'));
  const reactions = filteredArray(emojiReactionSchema).parse(data.toJS());

  if (reactions) {
    status.set('reactions', ImmutableList(reactions));
  }
};

/** Rewrite `<p></p>` to empty string. */
const fixContent = (status: ImmutableMap<string, any>) => {
  if (status.get('content') === '<p></p>') {
    return status.set('content', '');
  } else {
    return status;
  }
};

const normalizeFilterResults = (status: ImmutableMap<string, any>) =>
  status.update('filtered', ImmutableList(), filterResults =>
    filterResults.map((filterResult: ImmutableMap<string, any>) =>
      filterResult.getIn(['filter', 'title']),
    ),
  );

const parseAccount = (status: ImmutableMap<string, any>) => {
  try {
    const account = accountSchema.parse(maybeFromJS(status.get('account')));
    return status.set('account', account);
  } catch (_e) {
    return status.set('account', null);
  }
};

const parseGroup = (status: ImmutableMap<string, any>) => {
  try {
    const group = groupSchema.parse(status.get('group').toJS());
    return status.set('group', group);
  } catch (_e) {
    return status.set('group', null);
  }
};

export const normalizeStatus = (status: Record<string, any>) => {
  return StatusRecord(
    ImmutableMap(fromJS(status)).withMutations(status => {
      normalizeAttachments(status);
      normalizeMentions(status);
      normalizeEmojis(status);
      normalizeStatusPoll(status);
      normalizeStatusCard(status);
      fixMentionsOrder(status);
      addSelfMention(status);
      fixQuote(status);
      fixSensitivity(status);
      fixContent(status);
      normalizeFilterResults(status);
      parseAccount(status);
      parseGroup(status);
    }),
  );
};
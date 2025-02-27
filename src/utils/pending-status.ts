import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

import { normalizeStatus } from 'src/normalizers/status';
import { calculateStatus } from 'src/reducers/statuses';
import { makeGetAccount } from 'src/selectors';

import type { PendingStatus } from 'src/reducers/pending-statuses';
import type { RootState } from 'src/store';

const getAccount = makeGetAccount();

const buildMentions = (pendingStatus: PendingStatus) => {
  if (pendingStatus.in_reply_to_id) {
    return ImmutableList(pendingStatus.to || []).map(id => ImmutableMap({ id }));
  } else {
    return ImmutableList();
  }
};

const buildPoll = (pendingStatus: PendingStatus) => {
  if (pendingStatus.hasIn(['poll', 'options'])) {
    return pendingStatus.poll!.update('options', (options: ImmutableMap<string, any>) => {
      return options.map((title: string) => ImmutableMap({ title }));
    });
  } else {
    return null;
  }
};

export const buildStatus = (state: RootState, pendingStatus: PendingStatus, idempotencyKey: string) => {
  const me = state.me as string;
  const account = getAccount(state, me);
  const inReplyToId = pendingStatus.in_reply_to_id;

  const status = ImmutableMap({
    account,
    content: pendingStatus.status.replace(new RegExp('\n', 'g'), '<br>'), /* eslint-disable-line no-control-regex */
    id: `末pending-${idempotencyKey}`,
    in_reply_to_account_id: state.statuses.getIn([inReplyToId, 'account'], null),
    in_reply_to_id: inReplyToId,
    media_attachments: (pendingStatus.media_ids || ImmutableList()).map((id: string) => ImmutableMap({ id })),
    mentions: buildMentions(pendingStatus),
    poll: buildPoll(pendingStatus),
    quote: pendingStatus.quote_id,
    sensitive: pendingStatus.sensitive,
    visibility: pendingStatus.visibility,
  });

  return calculateStatus(normalizeStatus(status));
};
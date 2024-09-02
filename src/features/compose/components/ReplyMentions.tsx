import React, { useCallback } from 'react';
import { FormattedList, FormattedMessage } from 'react-intl';

import { openModal } from 'src/actions/modals';
import { useAccount } from 'src/api/hooks';
import { useAppDispatch, useAppSelector, useCompose, useOwnAccount } from 'src/hooks';
import { statusToMentionsAccountIdsArray } from 'src/reducers/compose';
import { makeGetStatus } from 'src/selectors';

import type { Status as StatusEntity } from 'src/types/entities';

interface IReplyMentions {
  composeId: string;
}

const ReplyMentions: React.FC<IReplyMentions> = ({ composeId }) => {
  const dispatch = useAppDispatch();
  const compose = useCompose(composeId);

  const getStatus = useCallback(makeGetStatus(), []);
  const status = useAppSelector<StatusEntity | null>(state => getStatus(state, { id: compose.in_reply_to! }));
  const to = compose.to;
  const { account } = useOwnAccount();

  const parentTo = status && statusToMentionsAccountIdsArray(status, account!);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    dispatch(openModal('REPLY_MENTIONS', {
      composeId,
    }));
  };

  if (!parentTo || (parentTo.size === 0)) {
    return null;
  }

  if (to.size === 0) {
    return (
      <a href='#' className='reply-mentions' onClick={handleClick}>
        <FormattedMessage
          id='reply_mentions.reply_empty'
          defaultMessage='Replying to post'
        />
      </a>
    );
  }

  const accounts = to.slice(0, 2).map((username: string) => {
    return (
      <span key={username} className='reply-mentions__account'>
        @{account ? account.username : username}
      </span>
    );
  }).toArray();

  if (to.size > 2) {
    accounts.push(
      <FormattedMessage id='reply_mentions.more' defaultMessage='{count} more' values={{ count: to.size - 2 }} />,
    );
  }

  return (
    <a href='#' className='reply-mentions' onClick={handleClick}>
      <FormattedMessage
        id='reply_mentions.reply'
        defaultMessage='Replying to {accounts}'
        values={{
          accounts: <FormattedList type='conjunction' value={accounts} />,
        }}
      />
    </a>
  );
};

export default ReplyMentions;
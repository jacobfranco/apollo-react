import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchAccount, fetchAccountByUsername } from 'src/actions/accounts';
import { fetchLikedStatuses, expandLikedStatuses, fetchAccountLikedStatuses, expandAccountLikedStatuses } from 'src/actions/likes';
import { useAccountLookup } from 'src/api/hooks';
import { MissingIndicator, StatusList } from 'src/components';
import { Column as Column } from 'src/components/Column'
import { useAppDispatch, useAppSelector, useOwnAccount } from 'src/hooks';

const messages = defineMessages({
  heading: { id: 'column.Liked_statuses', defaultMessage: 'Liked posts' },
});

interface ILikes {
  params?: {
    username?: string;
  };
}

/** Timeline displaying a user's Liked statuses. */
const Likes: React.FC<ILikes> = ({ params }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { account: ownAccount } = useOwnAccount();
  const { account, isUnavailable } = useAccountLookup(params?.username, { withRelationship: true });

  const username = params?.username || '';
  const isOwnAccount = username === ownAccount?.username;

  const timelineKey = isOwnAccount ? 'likes' : `likes:${account?.id}`;
  const statusIds = useAppSelector(state => state.status_lists.get(timelineKey)?.items || ImmutableOrderedSet<string>());
  const isLoading = useAppSelector(state => state.status_lists.get(timelineKey)?.isLoading === true);
  const hasMore = useAppSelector(state => !!state.status_lists.get(timelineKey)?.next);

  const handleLoadMore = useCallback(debounce(() => {
    if (isOwnAccount) {
      dispatch(expandLikedStatuses());
    } else if (account) {
      dispatch(expandAccountLikedStatuses(account.id));
    }
  }, 300, { leading: true }), [account?.id]);

  useEffect(() => {
    if (isOwnAccount)
      dispatch(fetchLikedStatuses());
    else {
      if (account) {
        dispatch(fetchAccount(account.id));
        dispatch(fetchAccountLikedStatuses(account.id));
      } else {
        dispatch(fetchAccountByUsername(username));
      }
    }
  }, []);

  useEffect(() => {
    if (account && !isOwnAccount) {
      dispatch(fetchAccount(account.id));
      dispatch(fetchAccountLikedStatuses(account.id));
    }
  }, [account?.id]);

  if (isUnavailable) {
    return (
      <Column>
        <div className='empty-column-indicator'>
          <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />
        </div>
      </Column>
    );
  }

  if (!account) {
    return (
      <MissingIndicator />
    );
  }

  const emptyMessage = isOwnAccount
    ? <FormattedMessage id='empty_column.Liked_statuses' defaultMessage="You don't have any liked posts yet. When you like one, it will show up here." />
    : <FormattedMessage id='empty_column.account_Liked_statuses' defaultMessage="This user doesn't have any liked posts yet." />;

  return (
    <Column label={intl.formatMessage(messages.heading)} withHeader={false} transparent>
      <StatusList
        statusIds={statusIds}
        scrollKey='Liked_statuses'
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        emptyMessage={emptyMessage}
      />
    </Column>
  );
};

export default Likes;
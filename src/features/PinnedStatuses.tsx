import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { fetchPinnedStatuses } from 'src/actions/pin-statuses';
import { MissingIndicator, StatusList } from 'src/components';
import { Column } from 'src/components/Column'
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { selectOwnAccount } from 'src/selectors';

const messages = defineMessages({
  heading: { id: 'column.pins', defaultMessage: 'Pinned posts' },
});

const PinnedStatuses = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { username } = useParams<{ username: string }>();

  const meUsername = useAppSelector((state) => selectOwnAccount(state)?.username || '');
  const statusIds = useAppSelector((state) => state.status_lists.get('pins')!.items);
  const isLoading = useAppSelector((state) => !!state.status_lists.get('pins')!.isLoading);
  const hasMore = useAppSelector((state) => !!state.status_lists.get('pins')!.next);

  const isMyAccount = username.toLowerCase() === meUsername.toLowerCase();

  useEffect(() => {
    dispatch(fetchPinnedStatuses());
  }, []);

  if (!isMyAccount) {
    return (
      <MissingIndicator />
    );
  }

  return (
    <Column label={intl.formatMessage(messages.heading)} transparent>
      <StatusList
        statusIds={statusIds}
        scrollKey='pinned_statuses'
        hasMore={hasMore}
        isLoading={isLoading}
        emptyMessage={<FormattedMessage id='pinned_statuses.none' defaultMessage='No pins to show.' />}
      />
    </Column>
  );
};

export default PinnedStatuses;
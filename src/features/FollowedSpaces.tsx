import debounce from 'lodash/debounce';
import React, { useEffect } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { fetchFollowedSpaces, expandFollowedSpaces } from 'src/actions/spaces';
import { Space, PlaceholderSpace, ScrollableList } from 'src/components';
import { Column } from 'src/components/Column'
import { useAppDispatch, useAppSelector } from 'src/hooks';

const messages = defineMessages({
  heading: { id: 'column.followed_spaces', defaultMessage: 'Followed spaces' },
});

const handleLoadMore = debounce((dispatch) => {
  dispatch(expandFollowedSpaces());
}, 300, { leading: true });

const FollowedSpaces = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFollowedSpaces());
  }, []);

  const spaces = useAppSelector((state => state.followed_spaces.items));
  const isLoading = useAppSelector((state => state.followed_spaces.isLoading));
  const hasMore = useAppSelector((state => !!state.followed_spaces.next));

  const emptyMessage = <FormattedMessage id='empty_column.followed_spaces' defaultMessage="You haven't followed any spaces yet." />;

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey='followed_spaces'
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={() => handleLoadMore(dispatch)}
        placeholderComponent={PlaceholderSpace}
        placeholderCount={5}
        itemClassName='pb-3'
      >
        {spaces.map(space => <Space key={space.name} space={space} />)}
      </ScrollableList>
    </Column>
  );
};

export default FollowedSpaces;
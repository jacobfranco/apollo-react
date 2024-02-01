import React, { useEffect, useRef } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { expandHomeTimeline } from 'src/actions/timelines';
import PullToRefresh from 'src/components/pull-to-refresh';
import { Stack, Text } from 'src/components';
import { Column } from 'src/components/Column'
import Timeline from 'src/features/Timeline';
import { useAppSelector, useAppDispatch } from 'src/hooks';

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
});

const HomeTimeline: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const polling = useRef<NodeJS.Timeout | null>(null);

  const isPartial = useAppSelector(state => state.timelines.get('home')?.isPartial === true);
  const next = useAppSelector(state => state.timelines.get('home')?.next);

  const handleLoadMore = (maxId: string) => {
    dispatch(expandHomeTimeline({ url: next, maxId }));
  };

  // Mastodon generates the feed in Redis, and can return a partial timeline
  // (HTTP 206) for new users. Poll until we get a full page of results.
  const checkIfReloadNeeded = () => {
    if (isPartial) {
      polling.current = setInterval(() => {
        dispatch(expandHomeTimeline());
      }, 3000);
    } else {
      stopPolling();
    }
  };

  const stopPolling = () => {
    if (polling.current) {
      clearInterval(polling.current);
      polling.current = null;
    }
  };

  const handleRefresh = () => {
    return dispatch(expandHomeTimeline());
  };

  useEffect(() => {
    checkIfReloadNeeded();

    return () => {
      stopPolling();
    };
  }, [isPartial]);

  return (
    <Column label={intl.formatMessage(messages.title)} transparent withHeader={false}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Timeline
          scrollKey='home_timeline'
          onLoadMore={handleLoadMore}
          timelineId='home'
          divideType='space'
          showAds
          emptyMessage={
            <Stack space={1}>
              <Text size='xl' weight='medium' align='center'>
                <FormattedMessage
                  id='empty_column.home.title'
                  defaultMessage="You're not following anyone yet"
                />
              </Text>

              <Text theme='muted' align='center'>
                <FormattedMessage
                  id='empty_column.home.subtitle'
                  defaultMessage='{siteTitle} gets more interesting once you follow other users.'
                  values={{ siteTitle: 'Apollo' }}
                />
              </Text>
            </Stack>
          }
        />
      </PullToRefresh>
    </Column>
  );
};

export default HomeTimeline;
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { expandCommunityTimeline } from 'src/actions/timelines';
import { useCommunityStream } from 'src/api/hooks';
import { Column, PullToRefresh, SiteBanner } from 'src/components';
import Timeline from 'src/features/Timeline'
import { useAppSelector, useAppDispatch } from 'src/hooks';

const LandingTimeline = () => {
  const dispatch = useAppDispatch();

  const next = useAppSelector(state => state.timelines.get('community')?.next);

  const timelineId = 'community';

  const handleLoadMore = (maxId: string) => {
      dispatch(expandCommunityTimeline({ url: next, maxId }));
  };

  const handleRefresh = async () => {
      return dispatch(expandCommunityTimeline());
  };

  useCommunityStream({ enabled: true });

  useEffect(() => {
      dispatch(expandCommunityTimeline());
  }, []);

  return (
    <Column transparent withHeader={false}>
      <div className='my-12 mb-16 px-4 sm:mb-20'>
        <SiteBanner />
      </div>

        <PullToRefresh onRefresh={handleRefresh}>
          <Timeline
            scrollKey={`${timelineId}_timeline`}
            timelineId={timelineId}
            prefix='home'
            onLoadMore={handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
            divideType='space'
          />
        </PullToRefresh>

    </Column>
  );
};

export default LandingTimeline;
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { expandCommunityTimeline } from 'src/actions/timelines';
import { useCommunityStream } from 'src/api/hooks';
import { Column, PullToRefresh, SiteBanner } from 'src/components';
import Timeline from 'src/features/Timeline'
import { useAppSelector, useAppDispatch } from 'src/hooks';

import AboutPage from '../about';

const LandingTimeline = () => {
  const dispatch = useAppDispatch();

  const timelineEnabled = true;
  const next = useAppSelector(state => state.timelines.get('community')?.next);

  const timelineId = 'community';

  const handleLoadMore = (maxId: string) => {
    if (timelineEnabled) {
      dispatch(expandCommunityTimeline({ url: next, maxId }));
    }
  };

  const handleRefresh = async () => {
    if (timelineEnabled) {
      return dispatch(expandCommunityTimeline());
    }
  };

  useCommunityStream({ enabled: timelineEnabled });

  useEffect(() => {
    if (timelineEnabled) {
      dispatch(expandCommunityTimeline());
    }
  }, []);

  return (
    <Column transparent withHeader={false}>
      <div className='my-12 mb-16 px-4 sm:mb-20'>
        <SiteBanner />
      </div>

      {timelineEnabled ? (
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
      ) : (
        <AboutPage />
      )}
    </Column>
  );
};

export default LandingTimeline;
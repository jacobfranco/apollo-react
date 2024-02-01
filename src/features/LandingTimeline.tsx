import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { expandCommunityTimeline } from 'src/actions/timelines';
import { useCommunityStream } from 'src/api/hooks';
import PullToRefresh from 'src/components/pull-to-refresh';
import { Column } from 'src/components/Column';
import { useAppSelector, useAppDispatch } from 'src/hooks';

import AboutPage from '../about';
import Timeline from '../ui/components/timeline';

import { SiteBanner } from './components/site-banner';

const LandingTimeline = () => {
  const dispatch = useAppDispatch();

  const timelineEnabled = !instance.pleroma.metadata.restrict_unauthenticated.timelines.local;
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
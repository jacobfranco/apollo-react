import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { expandSpaceTimeline, clearTimeline } from 'src/actions/timelines';
import { useSpaceStream } from 'src/api/hooks';
import Timeline from 'src/features/Timeline';
import { useAppDispatch, useAppSelector, useTheme } from 'src/hooks';
import { useIsMobile } from 'src/hooks';

interface ISpaceTimeline {
  spacePath: string;
}

export const SpaceTimeline: React.FC<ISpaceTimeline> = ({ spacePath }) => {
  const dispatch = useAppDispatch();
  const space = useAppSelector((state) =>
    state.spaces.byUrl.get(spacePath) || state.spaces.byName.get(spacePath)
  );
  const next = useAppSelector(state => state.timelines.get(`space:${spacePath}`)?.next);
  const theme = useTheme();
  const isMobile = useIsMobile();

  const handleLoadMore = (maxId: string) => {
    dispatch(expandSpaceTimeline(spacePath, { url: next, maxId }));
  };

  useSpaceStream(spacePath);

  useEffect(() => {
    if (space) {
      dispatch(expandSpaceTimeline(spacePath));
    }
    return () => {
      dispatch(clearTimeline(`space:${spacePath}`));
    };
  }, [spacePath, space, dispatch]);

  if (!space) {
    return <div>Loading...</div>;
  }

  return (
    <Timeline
      className='black:p-4 black:sm:p-5'
      scrollKey={`space_timeline:${spacePath}`}
      timelineId={`space:${spacePath}`}
      onLoadMore={handleLoadMore}
      emptyMessage={<FormattedMessage id='empty_column.space' defaultMessage='There is nothing in this space yet.' />}
      divideType={(theme === 'dark' || isMobile) ? 'border' : 'space'}
    />
  );
};

export default SpaceTimeline;
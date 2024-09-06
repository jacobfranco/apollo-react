import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { followSpace, unfollowSpace } from 'src/actions/spaces';
import { expandSpaceTimeline, clearTimeline } from 'src/actions/timelines';
import { useSpaceStream } from 'src/api/hooks';
import { List, ListItem, Toggle } from 'src/components';
import { Column } from 'src/components/Column'
import Timeline from 'src/features/Timeline';
import { useAppDispatch, useAppSelector, useLoggedIn, useTheme } from 'src/hooks';
import { useIsMobile } from 'src/hooks';

interface ISpaceTimeline {
  spacePath: string;
}

export const SpaceTimeline: React.FC<ISpaceTimeline> = ({ spacePath }) => {
  const dispatch = useAppDispatch();
  const space = useAppSelector((state) => {
    return state.spaces.byUrl.get(spacePath) || state.spaces.byName.get(spacePath);
  });
  const next = useAppSelector(state => state.timelines.get(`space:${spacePath}`)?.next);
  const { isLoggedIn } = useLoggedIn();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const handleLoadMore = (maxId: string) => {
    dispatch(expandSpaceTimeline(spacePath, { url: next, maxId }));
  };

  const handleFollow = () => {
    if (!space) {
      console.error('Cannot follow/unfollow: Space is undefined');
      return;
    }
    const spaceUrl = space.get('url').replace(/^\/s\//, '');
    if (!spaceUrl) {
      console.error('Cannot follow/unfollow: Space URL is undefined');
      return;
    }
    if (space.get('following')) {
      dispatch(unfollowSpace(spaceUrl));
    } else {
      dispatch(followSpace(spaceUrl));
    }
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
    <Column label={`/s/${spacePath}`} transparent={!isMobile}>
      {isLoggedIn && (
        <List>
          <ListItem
            label={<FormattedMessage id='space.follow' defaultMessage='Follow space' />}
          >
            <Toggle
              checked={space.get('following')}
              onChange={handleFollow}
            />
          </ListItem>
        </List>
      )}
      <Timeline
        className='black:p-4 black:sm:p-5'
        scrollKey={`space_timeline:${spacePath}`}
        timelineId={`space:${spacePath}`}
        onLoadMore={handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.space' defaultMessage='There is nothing in this space yet.' />}
        divideType={(theme === 'dark' || isMobile) ? 'border' : 'space'}
      />
    </Column>
  );
};

export default SpaceTimeline;
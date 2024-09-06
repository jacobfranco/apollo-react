import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { setFilter } from 'src/actions/search';
import Space from 'src/components/Space';
import { Text, Widget } from 'src/components/';
import PlaceholderSidebarTrends from 'src/components/PlaceholderSidebarTrendingSpaces';
import { useAppDispatch } from 'src/hooks';
import useTrendingSpaces from 'src/queries/trending-spaces';

interface ITrendingSpacesPanel {
  limit: number;
}

const messages = defineMessages({
  viewAll: {
    id: 'trending_spaces_panel.view_all',
    defaultMessage: 'View all',
  },
});

const TrendingSpacesPanel = ({ limit }: ITrendingSpacesPanel) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const { data: trendingSpaces, isFetching } = useTrendingSpaces();

  const setSpacesFilter = () => {
    dispatch(setFilter('hashtags'));  //TODO: need to change to spaces and implement the implementation
  };

  if (!isFetching && !trendingSpaces?.length) {
    return null;
  }

  return (
    <Widget
      title={<FormattedMessage id='trending_spaces.title' defaultMessage='Spaces' />}
      action={
        <Link className='text-right' to='/s' onClick={setSpacesFilter}>
          <Text tag='span' theme='primary' size='sm' className='hover:underline'>
            {intl.formatMessage(messages.viewAll)}
          </Text>
        </Link>
      }
    >
      {isFetching ? (
        <PlaceholderSidebarTrends limit={limit} />
      ) : (
        trendingSpaces?.slice(0, limit).map((space) => (
          <Space key={space.name} space={space} />
        ))
      )}
    </Widget>
  );
};

export default TrendingSpacesPanel;
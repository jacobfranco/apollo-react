import React, { useState, useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Tabs } from 'src/components';
import { CommunityTab, MediaTab } from './AsyncComponents';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { fetchSpace } from 'src/actions/spaces';
import SpaceTimeline from './SpaceTimeline';

const messages = defineMessages({
  community: { id: 'spaces_page.community', defaultMessage: 'Community' },
  media: { id: 'spaces_page.media', defaultMessage: 'Media' },
  loading: { id: 'spaces_page.loading', defaultMessage: 'Loading space...' },
});

const SpacePage: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { spaceName } = useParams<{ spaceName: string }>();
  const [selectedTab, setSelectedTab] = useState('community');

  const space = useAppSelector((state) => {
    console.log('State in selector:', state.spaces);
    console.log('Looking for space with URL:', spaceName);

    return state.spaces.byUrl.get(spaceName) || state.spaces.byName.get(spaceName);
  });

  useEffect(() => {
    console.log(`SpacePage mounted/updated for space: ${spaceName}`);
    if (spaceName && !space) {
      console.log(`Fetching space: ${spaceName}`);
      dispatch(fetchSpace(spaceName));
    } else {
      console.log(`Space ${spaceName} already in state or fetched, space:`, space ? space.toJS() : null);
    }
  }, [dispatch, spaceName, space]);

  console.log('Rendering SpacePage, space:', space ? space.toJS() : null);

  if (!space) {
    console.log('Space is null, showing loading message');
    return <div className="text-center text-red-500">{intl.formatMessage(messages.loading)}</div>;
  }

  const selectTab = (tab: string) => setSelectedTab(tab);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'community':
        return <SpaceTimeline spacePath={spaceName} />;
      case 'media':
        return <MediaTab />;
      default:
        return null;
    }
  };

  const renderTabBar = () => {
    const items = [
      {
        text: intl.formatMessage(messages.community),
        action: () => selectTab('community'),
        name: 'community',
      },
      {
        text: intl.formatMessage(messages.media),
        action: () => selectTab('media'),
        name: 'media',
      },
    ];
    return <Tabs items={items} activeItem={selectedTab} />;
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{space.get('name')} Space</h1>
      {renderTabBar()}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </>
  );
};

export default SpacePage;
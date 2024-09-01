import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { Tabs } from 'src/components';

import { CommunityTab, MediaTab } from './AsyncComponents';
import spacesConfig from 'src/spaces-config';

const messages = defineMessages({
  community: { id: 'spaces_page.community', defaultMessage: 'Community' },
  media: { id: 'spaces_page.media', defaultMessage: 'Media' },
});

const SpacePage = () => {
  const intl = useIntl();
  const { spaceName } = useParams<{ spaceName: string }>();
  const space = spacesConfig.find(s => s.path === spaceName);

  if (!space) {
    return <div className="text-center text-red-500">Invalid space name</div>;
  }

  const [selectedTab, setSelectedTab] = useState('community');

  const selectTab = (tab: string) => setSelectedTab(tab);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'community':
        return <CommunityTab />;
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
      <h1 className="text-2xl font-bold mb-6">{space.name} Space</h1>
      {renderTabBar()}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </>
  );
};

export default SpacePage;
import clsx from 'clsx';
import React, { useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { HStack, Tabs } from 'src/components';

import type { VirtuosoHandle } from 'react-virtuoso';

import { ScoresTab, StandingsTab, StatsTab } from './AsyncComponents'

const messages = defineMessages({
  scores: { id: 'game_page.scores', defaultMessage: 'Scores' },
  standings: { id: 'game_page.standings', defaultMessage: 'Standings' },
  stats: { id: 'game_page.stats', defaultMessage: 'Stats' },
});

const GamePage = () => {
  const node = useRef<VirtuosoHandle>(null);

  const intl = useIntl();

  const [selectedTab, setSelectedTab] = React.useState('scores');

  const selectTab = (tab: string) => setSelectedTab(tab);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'scores':
        return <ScoresTab />;
      case 'standings':
        return <StandingsTab />;
      case 'stats':
        return <StatsTab />;
      default:
        return null;
    }
  };

  const renderFilterBar = () => {
    const items = [
      {
        text: intl.formatMessage(messages.scores),
        action: () => selectTab('scores'),
        name: 'scores',
      },
      {
        text: intl.formatMessage(messages.standings),
        action: () => selectTab('standings'),
        name: 'standings',
      },
      {
        text: intl.formatMessage(messages.stats),
        action: () => selectTab('stats'),
        name: 'stats',
      },
    ];

    return <Tabs items={items} activeItem={selectedTab} />;
  };

  return (
    <>
      <HStack className='mb-4 border-b border-solid border-gray-200 px-2 pb-4 dark:border-gray-800' space={2}>
      </HStack>
      {renderFilterBar()}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </>
  );
};

export default GamePage;

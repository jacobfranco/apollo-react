import clsx from 'clsx';
import React, { useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { HStack, Tabs } from 'src/components';

import type { VirtuosoHandle } from 'react-virtuoso';

import { ScoresTab, StandingsTab, StatsTab } from './AsyncComponents'
import gameConfig from 'src/game-config';

const messages = defineMessages({
  scores: { id: 'game_page.scores', defaultMessage: 'Scores' },
  standings: { id: 'game_page.standings', defaultMessage: 'Standings' },
  stats: { id: 'game_page.stats', defaultMessage: 'Stats' },
});

const GamePage = () => {
  const node = useRef<VirtuosoHandle>(null);

  const intl = useIntl();

  const { gameName } = useParams<{ gameName: string }>();
  const game = gameConfig.find(g => g.path === gameName);

  if (!game) {
    return <div className="text-center text-red-500">Invalid game name</div>;
  }

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
    <h1 className="text-2xl font-bold mb-6">{game.name}</h1>
      {renderFilterBar()}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </>
  );
};

export default GamePage;

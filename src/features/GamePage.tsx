import clsx from 'clsx';
import React, { useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { HStack, Tabs } from 'src/components';

import type { VirtuosoHandle } from 'react-virtuoso';

import { StandingsTab, StatsTab, CommunityTab, MediaTab, EsportsTab, ScheduleTab, FantasyTab } from './AsyncComponents';
import gameConfig from 'src/game-config';

const messages = defineMessages({
  community: { id: 'game_page.community', defaultMessage: 'Community' },
  media: { id: 'game_page.media', defaultMessage: 'Media' },
  esports: { id: 'game_page.esports', defaultMessage: 'Esports' },
  schedule: { id: 'game_page.schedule', defaultMessage: 'Schedule' },
  standings: { id: 'game_page.standings', defaultMessage: 'Standings' },
  stats: { id: 'game_page.stats', defaultMessage: 'Stats' },
  fantasy: { id: 'game_page.fantasy', defaultMessage: 'Fantasy' },
});

const GamePage = () => {
  const node = useRef<VirtuosoHandle>(null);

  const intl = useIntl();

  const { gameName } = useParams<{ gameName: string }>();
  const game = gameConfig.find(g => g.path === gameName);

  if (!game) {
    return <div className="text-center text-red-500">Invalid game name</div>;
  }

  const [selectedTab, setSelectedTab] = React.useState('community');

  const selectTab = (tab: string) => setSelectedTab(tab);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'community':
        return <CommunityTab />;
      case 'media':
        return <MediaTab />;
      case 'esports':
        return game.isEsport ? <EsportsTab /> : null;
      case 'schedule':
        return game.isEsport && game.hasApiSupport ? <ScheduleTab /> : null;
      case 'standings':
        return game.isEsport && game.hasApiSupport ? <StandingsTab /> : null;
      case 'stats':
        return game.isEsport && game.hasApiSupport ? <StatsTab /> : null;
      case 'fantasy':
        return game.isEsport && game.hasApiSupport ? <FantasyTab /> : null;
      default:
        return null;
    }
  };

  const renderTabBar = () => {
    const items = game.isEsport
      ? game.hasApiSupport
        ? [
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
            {
              text: intl.formatMessage(messages.esports),
              action: () => selectTab('esports'),
              name: 'esports',
            },
            {
              text: intl.formatMessage(messages.schedule),
              action: () => selectTab('schedule'),
              name: 'schedule',
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
            {
              text: intl.formatMessage(messages.fantasy),
              action: () => selectTab('fantasy'),
              name: 'fantasy',
            },
          ]
        : [
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
            {
              text: intl.formatMessage(messages.esports),
              action: () => selectTab('esports'),
              name: 'esports',
            },
          ]
      : [
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
      <h1 className="text-2xl font-bold mb-6">{game.name}</h1>
      {renderTabBar()}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </>
  );
};

export default GamePage;

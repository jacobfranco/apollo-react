import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { Tabs } from 'src/components';

import { EsportsTab, ScheduleTab, TeamsTab, PlayersTab, FantasyTab } from './AsyncComponents';
import esportsConfig from 'src/esports-config';

const messages = defineMessages({
  esports: { id: 'esports_page.esports', defaultMessage: 'Esports' },
  schedule: { id: 'esports_page.schedule', defaultMessage: 'Schedule' },
  teams: { id: 'esports_page.teams', defaultMessage: 'Teams' },
  players: { id: 'esports_page.players', defaultMessage: 'Players' },
  fantasy: { id: 'esports_page.fantasy', defaultMessage: 'Fantasy' },
});

const EsportPage = () => {
  const intl = useIntl();
  const { esportName } = useParams<{ esportName: string }>();
  const game = esportsConfig.find(g => g.path === esportName);

  if (!game) {
    return <div className="text-center text-red-500">Invalid esport name</div>;
  }

  const [selectedTab, setSelectedTab] = useState('esports');

  const selectTab = (tab: string) => setSelectedTab(tab);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'esports':
        return <EsportsTab />;
      case 'schedule':
        return game.hasApiSupport ? <ScheduleTab /> : null;
      case 'teams':
        return game.hasApiSupport ? <TeamsTab /> : null;
      case 'players':
        return game.hasApiSupport ? <PlayersTab /> : null;
      case 'fantasy':
        return game.hasApiSupport ? <FantasyTab /> : null;
      default:
        return null;
    }
  };

  const renderTabBar = () => {
    const items = game.hasApiSupport
      ? [
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
          text: intl.formatMessage(messages.teams),
          action: () => selectTab('teams'),
          name: 'teams',
        },
        {
          text: intl.formatMessage(messages.players),
          action: () => selectTab('players'),
          name: 'players',
        },
        {
          text: intl.formatMessage(messages.fantasy),
          action: () => selectTab('fantasy'),
          name: 'fantasy',
        },
      ]
      : [
        {
          text: intl.formatMessage(messages.esports),
          action: () => selectTab('esports'),
          name: 'esports',
        },
      ];

    return <Tabs items={items} activeItem={selectedTab} />;
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{game.name} Esports</h1>
      {renderTabBar()}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </>
  );
};

export default EsportPage;
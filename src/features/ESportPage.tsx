import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { Tabs } from 'src/components';

import { EsportsTab, ScheduleTab, StandingsTab, StatsTab, FantasyTab } from './AsyncComponents';
import esportsConfig from 'src/esports-config';

const messages = defineMessages({
  esports: { id: 'esports_page.esports', defaultMessage: 'Esports' },
  schedule: { id: 'esports_page.schedule', defaultMessage: 'Schedule' },
  standings: { id: 'esports_page.standings', defaultMessage: 'Standings' },
  stats: { id: 'esports_page.stats', defaultMessage: 'Stats' },
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
      case 'standings':
        return game.hasApiSupport ? <StandingsTab /> : null;
      case 'stats':
        return game.hasApiSupport ? <StatsTab /> : null;
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
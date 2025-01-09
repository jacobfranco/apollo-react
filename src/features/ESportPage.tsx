import React, { lazy, useState, useEffect, Suspense, useCallback } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Route, Switch, useLocation, useParams } from "react-router-dom";
import { Tabs } from "src/components";
import { Column } from "src/components/Column";
import esportsConfig from "src/esports-config";
import { SpaceTimeline } from "./SpaceTimeline";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { fetchSpace } from "src/actions/spaces";
import {
  connectMatchUpdatesStream,
  connectSeriesUpdatesStream,
} from "src/actions/streaming";

import ScheduleTab from "./ScheduleTab";
import TeamsTab from "./TeamsTab";
import PlayersTab from "./PlayersTab";
import FantasyTab from "./FantasyTab";
import { fetchPlayers } from "src/actions/players";
import { fetchTeams } from "src/actions/teams";

const messages = defineMessages({
  esports: { id: "esports_page.esports", defaultMessage: "Esports" },
  schedule: { id: "esports_page.schedule", defaultMessage: "Schedule" },
  teams: { id: "esports_page.teams", defaultMessage: "Teams" },
  players: { id: "esports_page.players", defaultMessage: "Players" },
  fantasy: { id: "esports_page.fantasy", defaultMessage: "Fantasy" },
});

const TabLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

interface TabContainerProps {
  children: React.ReactNode;
}

const TabContainer = React.memo(({ children }: TabContainerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [children]);

  return isLoading ? <TabLoading /> : children;
});

const EsportPage = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { esportName } = useParams<{ esportName: string }>();
  const game = esportsConfig.find((g) => g.path === esportName);
  const spacePath = esportName + "esports";
  const space = useAppSelector((state) => state.spaces.get(spacePath));
  const currentPath = location.pathname;
  const activeTab = currentPath.split("/").pop() || "esports";

  const prefetchData = useCallback(
    (tabName: string) => {
      if (game?.hasApiSupport) {
        switch (tabName) {
          case "players":
            dispatch(fetchPlayers(esportName));
            break;
          case "teams":
            dispatch(fetchTeams(esportName));
            break;
        }
      }
    },
    [dispatch, esportName, game]
  );

  useEffect(() => {
    const disconnectSeriesUpdates = dispatch(connectSeriesUpdatesStream());
    const disconnectMatchUpdates = dispatch(connectMatchUpdatesStream());
    return () => {
      disconnectSeriesUpdates?.();
      disconnectMatchUpdates?.();
    };
  }, [dispatch]);

  useEffect(() => {
    if (spacePath && !space) {
      dispatch(fetchSpace(spacePath));
    }
  }, [dispatch, spacePath, space]);

  if (!game) {
    return <div className="text-center text-red-500">Invalid esport name</div>;
  }

  const renderTabBar = () => {
    const items = game.hasApiSupport
      ? [
          {
            text: intl.formatMessage(messages.esports),
            to: `/esports/${esportName}`,
            name: "esports",
            title: intl.formatMessage(messages.esports),
            onMouseEnter: () => prefetchData("esports"),
          },
          {
            text: intl.formatMessage(messages.schedule),
            to: `/esports/${esportName}/schedule`,
            name: "schedule",
            title: intl.formatMessage(messages.schedule),
            onMouseEnter: () => prefetchData("schedule"),
          },
          {
            text: intl.formatMessage(messages.teams),
            to: `/esports/${esportName}/teams`,
            name: "teams",
            title: intl.formatMessage(messages.teams),
            onMouseEnter: () => prefetchData("teams"),
          },
          {
            text: intl.formatMessage(messages.players),
            to: `/esports/${esportName}/players`,
            name: "players",
            title: intl.formatMessage(messages.players),
            onMouseEnter: () => prefetchData("players"),
          },
        ]
      : [
          {
            text: intl.formatMessage(messages.esports),
            to: `/esports/${esportName}`,
            name: "esports",
            title: intl.formatMessage(messages.esports),
          },
        ];

    return <Tabs items={items} activeItem={activeTab} />;
  };

  return (
    <Column label={game.name} transparent={false} withHeader={true}>
      <div className="space-y-6">
        {renderTabBar()}
        <div className="tab-content">
          <Suspense fallback={<TabLoading />}>
            <Switch>
              <Route exact path="/esports/:esportName">
                <TabContainer>
                  <SpaceTimeline spacePath={spacePath} />
                </TabContainer>
              </Route>
              <Route path="/esports/:esportName/schedule">
                {game.hasApiSupport ? (
                  <TabContainer>
                    <ScheduleTab />
                  </TabContainer>
                ) : null}
              </Route>
              <Route path="/esports/:esportName/teams">
                {game.hasApiSupport ? (
                  <TabContainer>
                    <TeamsTab />
                  </TabContainer>
                ) : null}
              </Route>
              <Route path="/esports/:esportName/players">
                {game.hasApiSupport ? (
                  <TabContainer>
                    <PlayersTab />
                  </TabContainer>
                ) : null}
              </Route>
            </Switch>
          </Suspense>
        </div>
      </div>
    </Column>
  );
};

export default EsportPage;

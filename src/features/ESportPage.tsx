import React, {
  useEffect,
  lazy,
  Suspense,
  useState,
  useMemo,
  useCallback,
} from "react";
import { defineMessages, useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import esportsConfig from "src/esports-config";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { fetchSpace } from "src/actions/spaces";
import { fetchPlayers } from "src/actions/players";
import { fetchTeams } from "src/actions/teams";

import Spinner from "src/components/Spinner";
import Tabs from "src/components/Tabs";
import { Column } from "src/components/Column";
import { SpaceTimeline } from "./SpaceTimeline";

// Lazy‐load each tab
const ScheduleTab = lazy(() => import("./ScheduleTab"));
const TeamsTab = lazy(() => import("./TeamsTab"));
const PlayersTab = lazy(() => import("./PlayersTab"));

const messages = defineMessages({
  esports: { id: "esports_page.esports", defaultMessage: "Esports" },
  schedule: { id: "esports_page.schedule", defaultMessage: "Schedule" },
  teams: { id: "esports_page.teams", defaultMessage: "Teams" },
  players: { id: "esports_page.players", defaultMessage: "Players" },
});

const EsportPage: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();

  // Look up which game config we’re dealing with
  const game = esportsConfig.find((g) => g.path === esportName);
  if (!game) {
    return <div className="text-center text-red-500">Invalid esport name</div>;
  }

  // Compose the “spacePath” for the SpaceTimeline
  const spacePath = `${game.path}esports`;

  // Default tab is the “esports” timeline
  const [activeTab, setActiveTab] = useState<
    "esports" | "schedule" | "teams" | "players"
  >("esports");

  // This key increments every time we switch tabs, forcing <Suspense> to remount
  const [tabKey, setTabKey] = useState(0);

  const handleTabChange = useCallback(
    (tabName: "esports" | "schedule" | "teams" | "players") => {
      setActiveTab(tabName);
      setTabKey((prev) => prev + 1);
    },
    []
  );

  // Fetch space, players, and teams once on mount or if esportName changes
  useEffect(() => {
    dispatch(fetchSpace(spacePath));
    if (game.hasApiSupport) {
      dispatch(fetchPlayers(esportName));
      dispatch(fetchTeams(esportName));
    }
  }, [dispatch, esportName, spacePath, game]);

  // Build out the tab items
  const tabItems = useMemo(() => {
    if (!game.hasApiSupport) {
      return [
        {
          name: "esports",
          text: intl.formatMessage(messages.esports),
          title: intl.formatMessage(messages.esports),
          action: () => handleTabChange("esports"),
        },
      ];
    }
    return [
      {
        name: "esports",
        text: intl.formatMessage(messages.esports),
        title: intl.formatMessage(messages.esports),
        action: () => handleTabChange("esports"),
      },
      {
        name: "schedule",
        text: intl.formatMessage(messages.schedule),
        title: intl.formatMessage(messages.schedule),
        action: () => handleTabChange("schedule"),
      },
      {
        name: "teams",
        text: intl.formatMessage(messages.teams),
        title: intl.formatMessage(messages.teams),
        action: () => handleTabChange("teams"),
      },
      {
        name: "players",
        text: intl.formatMessage(messages.players),
        title: intl.formatMessage(messages.players),
        action: () => handleTabChange("players"),
      },
    ];
  }, [game, intl, handleTabChange]);

  return (
    <Column label={game.name} transparent={false} withHeader>
      <div className="space-y-6">
        <Tabs items={tabItems} activeItem={activeTab} />

        {/* Render each tab. The timeline tab is shown by default. */}
        {activeTab === "esports" && <SpaceTimeline spacePath={spacePath} />}

        {activeTab === "schedule" && (
          <Suspense fallback={<Spinner />} key={`schedule-${tabKey}`}>
            <ScheduleTab />
          </Suspense>
        )}
        {activeTab === "teams" && (
          <Suspense fallback={<Spinner />} key={`teams-${tabKey}`}>
            <TeamsTab esportName={game.path} />
          </Suspense>
        )}
        {activeTab === "players" && (
          <Suspense fallback={<Spinner />} key={`players-${tabKey}`}>
            <PlayersTab esportName={game.path} />
          </Suspense>
        )}
      </div>
    </Column>
  );
};

export default EsportPage;

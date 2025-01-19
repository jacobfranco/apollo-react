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
import SpaceGallery from "./SpaceGallery";

// Lazy‐load each tab
const ScheduleTab = lazy(() => import("./ScheduleTab"));
const TeamsTab = lazy(() => import("./TeamsTab"));
const PlayersTab = lazy(() => import("./PlayersTab"));

const messages = defineMessages({
  esports: { id: "esports_page.esports", defaultMessage: "Esports" },
  schedule: { id: "esports_page.schedule", defaultMessage: "Schedule" },
  teams: { id: "esports_page.teams", defaultMessage: "Teams" },
  players: { id: "esports_page.players", defaultMessage: "Players" },
  media: { id: "esports_page.media", defaultMessage: "Media" },
});

type TabType = "esports" | "media" | "schedule" | "teams" | "players";

const EsportPage: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();

  // Look up which game config we're dealing with
  const game = useMemo(
    () => esportsConfig.find((g) => g.path === esportName),
    [esportName]
  );

  // Default tab is the "esports" timeline
  const [activeTab, setActiveTab] = useState<TabType>("esports");

  // This key increments every time we switch tabs, forcing <Suspense> to remount
  const [tabKey, setTabKey] = useState(0);

  const handleTabChange = useCallback((tabName: TabType) => {
    setActiveTab(tabName);
    setTabKey((prev) => prev + 1);
  }, []);

  // Compose the "spacePath" for the SpaceTimeline
  const spacePath = useMemo(() => (game ? `${game.path}esports` : ""), [game]);

  // Fetch space, players, and teams once on mount or if esportName changes
  useEffect(() => {
    if (spacePath) {
      dispatch(fetchSpace(spacePath));
      if (game?.hasApiSupport) {
        dispatch(fetchPlayers(esportName));
        dispatch(fetchTeams(esportName));
      }
    }
  }, [dispatch, esportName, spacePath, game]);

  // Build out the tab items
  const tabItems = useMemo(() => {
    if (!game) return [];

    const baseEsportsTab = [
      {
        name: "esports",
        text: intl.formatMessage(messages.esports),
        title: intl.formatMessage(messages.esports),
        action: () => handleTabChange("esports"),
      },
    ];

    const mediaTab = [
      {
        name: "media",
        text: intl.formatMessage(messages.media),
        title: intl.formatMessage(messages.media),
        action: () => handleTabChange("media"),
      },
    ];

    if (!game.hasApiSupport) {
      return [...baseEsportsTab, ...mediaTab];
    }

    const apiSupportedTabs = [
      ...baseEsportsTab,
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
      ...mediaTab,
    ];

    return apiSupportedTabs;
  }, [game, intl, handleTabChange]);

  if (!game) {
    return <div className="text-center text-red-500">Invalid esport name</div>;
  }

  return (
    <Column label={game.name} transparent={false} withHeader>
      <div className="space-y-6">
        <Tabs items={tabItems} activeItem={activeTab} />

        {/* Render each tab */}
        {activeTab === "esports" && <SpaceTimeline spacePath={spacePath} />}

        {activeTab === "media" && (
          <Suspense fallback={<Spinner />} key={`media-${tabKey}`}>
            <SpaceGallery spacePath={spacePath} />
          </Suspense>
        )}

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

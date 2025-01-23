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
import { useAppDispatch, useAppSelector, useLoggedIn } from "src/hooks";
import { fetchSpace, followSpace, unfollowSpace } from "src/actions/spaces";
import { fetchPlayers } from "src/actions/players";
import { fetchTeams } from "src/actions/teams";
import Spinner from "src/components/Spinner";
import Tabs from "src/components/Tabs";
import { Column } from "src/components/Column";
import { SpaceTimeline } from "./SpaceTimeline";
import SpaceGallery from "./SpaceGallery";
import Button from "src/components/Button";
import plusIcon from "@tabler/icons/outline/plus.svg";
import { buildImageUrl } from "src/utils/image";

// Lazy‐load each tab
const ScheduleTab = lazy(() => import("./ScheduleTab"));
const TeamsTab = lazy(() => import("./TeamsTab"));
const PlayersTab = lazy(() => import("./PlayersTab"));

const messages = defineMessages({
  esports: { id: "esports_page.esports", defaultMessage: "Community" },
  schedule: { id: "esports_page.schedule", defaultMessage: "Schedule" },
  teams: { id: "esports_page.teams", defaultMessage: "Teams" },
  players: { id: "esports_page.players", defaultMessage: "Players" },
  media: { id: "esports_page.media", defaultMessage: "Media" },
  loading: { id: "spaces_page.loading", defaultMessage: "Loading space..." },
  follow: { id: "space.follow", defaultMessage: "Follow" },
  unfollow: { id: "space.unfollow", defaultMessage: "Unfollow" },
});

type TabType = "esports" | "media" | "schedule" | "teams" | "players";

const EsportPage: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();
  const { isLoggedIn } = useLoggedIn();

  // Compose the space path
  const spacePath = useMemo(() => `${esportName}esports`, [esportName]);

  // Get the space data
  const space = useAppSelector((state) => state.spaces.get(spacePath));

  // Look up which game config we're dealing with - only for hasApiSupport
  const game = useMemo(
    () => esportsConfig.find((g) => g.path === esportName),
    [esportName]
  );

  // Default tab is "schedule"
  const [activeTab, setActiveTab] = useState<TabType>("schedule");
  const [tabKey, setTabKey] = useState(0);

  const handleTabChange = useCallback((tabName: TabType) => {
    setActiveTab(tabName);
    setTabKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (spacePath) {
      dispatch(fetchSpace(spacePath));
      if (game?.hasApiSupport) {
        dispatch(fetchPlayers(esportName));
        dispatch(fetchTeams(esportName));
      }
    }
  }, [dispatch, esportName, spacePath, game]);

  const handleFollow = () => {
    const shortId = space?.get("id");
    if (!shortId) return;
    if (space?.get("following")) {
      dispatch(unfollowSpace(shortId));
    } else {
      dispatch(followSpace(shortId));
    }
  };

  // Build out the tab items
  const tabItems = useMemo(() => {
    if (!game) return [];
    const esportsTab = [
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
      return [...esportsTab, ...mediaTab];
    }

    const apiSupportedTabs = [
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
      ...esportsTab,
      ...mediaTab,
    ];
    return apiSupportedTabs;
  }, [game, intl, handleTabChange]);

  if (!space) {
    return (
      <div className="text-center text-gray-500">
        {intl.formatMessage(messages.loading)}
      </div>
    );
  }

  return (
    <Column transparent={false} withHeader>
      <div className="flex flex-col space-y-2">
        {/* Header with backdrop image */}
        <div className="relative overflow-hidden -mt-16 -mx-4 rounded-lg">
          {/* Backdrop Image */}
          {space.get("imageUrl") && (
            <div className="absolute inset-0">
              <img
                src={buildImageUrl(space.get("imageUrl"), {
                  width: 1200,
                  height: 600,
                })}
                alt=""
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = space.get("imageUrl");
                }}
              />
              {/* Gradient overlay - lighter for more image visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 rounded-t-lg" />
            </div>
          )}

          {/* Content */}
          <div className="relative px-6 pb-2 pt-28">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-baseline space-x-2 px-4 py-2 rounded-lg bg-primary-400/20 dark:bg-secondary-800/40 backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-white">
                  {space.get("name")}
                </h1>
                <span className="text-md font-bold text-gray-300">
                  /s/{spacePath}
                </span>
              </div>
              {isLoggedIn && (
                <Button
                  theme={space.get("following") ? "secondary" : "primary"}
                  size="sm"
                  icon={!space.get("following") ? plusIcon : undefined}
                  onClick={handleFollow}
                >
                  {space.get("following")
                    ? intl.formatMessage(messages.unfollow)
                    : intl.formatMessage(messages.follow)}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs items={tabItems} activeItem={activeTab} />

        {/* Tab content */}
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
            <TeamsTab esportName={game!.path} />
          </Suspense>
        )}
        {activeTab === "players" && (
          <Suspense fallback={<Spinner />} key={`players-${tabKey}`}>
            <PlayersTab esportName={game!.path} />
          </Suspense>
        )}
      </div>
    </Column>
  );
};

export default EsportPage;

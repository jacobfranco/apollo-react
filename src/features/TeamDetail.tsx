// TeamDetail.tsx

import React, { useState, useEffect, useMemo } from "react";
import twitterIcon from "@tabler/icons/outline/brand-twitter.svg";
import twitchIcon from "@tabler/icons/outline/brand-twitch.svg";
import youtubeIcon from "@tabler/icons/outline/brand-youtube.svg";
import worldIcon from "@tabler/icons/outline/world.svg";
import { Link, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import {
  selectTeamById,
  selectTeamLoading,
  selectTeamError,
  hasFetchedPlayersByRosterId,
  selectPlayersByRosterId,
  selectRosterPlayersLoading,
  selectRosterPlayersError,
  selectHasFetchedSeriesById,
} from "src/selectors";
import { fetchTeamById } from "src/actions/teams";
import { fetchPlayersByRosterId } from "src/actions/players";
import { Card, CardBody } from "src/components/Card";
import { Column } from "src/components/Column";
import SvgIcon from "src/components/SvgIcon";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { formatStat, formatGold } from "src/utils/esports";
import { TeamAggStats } from "src/schemas/team-agg-stats";
import { useTheme } from "src/hooks/useTheme";
import { useTeamData } from "src/teams";
import PlayerPreview from "src/components/PlayerPreview";
import { Player } from "src/schemas/player";
import { formatShortDate } from "src/utils/dates";
import { TeamMatchStats } from "src/schemas/team-match-stats";
import StatsTable from "src/components/StatsTable";
import { Series } from "src/schemas/series";
import LolLiveScoreboard from "src/components/LolLiveScoreboard";
import LolScoreboard from "src/components/LolScoreboard";
import { fetchSeriesById } from "src/actions/series";
import { Tabs } from "src/components";
import AutoFitText from "src/components/AutoFitText";

type TeamDetailParams = {
  esportName: string;
  teamId: string;
};

type StatEntry = {
  label: string;
  key: keyof TeamAggStats;
  formatter: (value: number) => string;
};

const TeamDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName, teamId } = useParams<TeamDetailParams>();
  const teamIdNumber = Number(teamId);

  // Team Data Hooks
  const team = useAppSelector((state) => selectTeamById(state, teamIdNumber));
  const loading = useAppSelector((state) =>
    selectTeamLoading(state, teamIdNumber)
  );
  const error = useAppSelector((state) => selectTeamError(state, teamIdNumber));

  // UI and Theme Hooks
  const getTeamData = useTeamData();
  const theme = useTheme();

  // Derive rosterId (can be undefined)
  const rosterId = team?.standingRoster?.rosterId;

  // Roster Players Hooks
  const rosterPlayers = useAppSelector((state) =>
    rosterId ? selectPlayersByRosterId(state, rosterId) : []
  );
  const rosterLoading = useAppSelector((state) =>
    rosterId ? selectRosterPlayersLoading(state, rosterId) : false
  );
  const rosterError = useAppSelector((state) =>
    rosterId ? selectRosterPlayersError(state, rosterId) : null
  );

  // Check if roster players have been fetched
  const hasFetchedRosterPlayers = useAppSelector((state) =>
    rosterId ? hasFetchedPlayersByRosterId(state, rosterId) : false
  );

  // Sorting state for season stats
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "start",
    direction: "desc",
  });

  // Tabs State
  const [selectedTab, setSelectedTab] = useState("stats");

  // Define Tab Items
  const tabItems = [
    {
      text: "Stats",
      action: () => setSelectedTab("stats"),
      name: "stats",
    },
    {
      text: "Schedule",
      action: () => setSelectedTab("schedule"),
      name: "schedule",
    },
  ];

  const handleSort = (key: string) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig && prevSortConfig.key === key) {
        return {
          key,
          direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          key,
          direction: "desc",
        };
      }
    });
  };

  // Fetch Team Data
  useEffect(() => {
    dispatch(fetchTeamById(esportName, teamIdNumber));
  }, [dispatch, esportName, teamIdNumber]);

  // Fetch Roster Players if Needed
  useEffect(() => {
    if (
      rosterId &&
      !rosterLoading &&
      !hasFetchedRosterPlayers &&
      !rosterError
    ) {
      dispatch(fetchPlayersByRosterId(rosterId));
    }
  }, [dispatch, rosterId, rosterLoading, hasFetchedRosterPlayers, rosterError]);

  // Compute validSeasonStats
  const validSeasonStats = useMemo(() => {
    const seasonStats = team?.lolSeasonStats ?? [];
    return seasonStats.filter(
      (matchStat): matchStat is TeamMatchStats =>
        matchStat !== null && matchStat !== undefined
    );
  }, [team?.lolSeasonStats]);

  const sortedSeasonStats = useMemo<TeamMatchStats[]>(() => {
    if (!sortConfig) return validSeasonStats;
    return [...validSeasonStats].sort((a, b) => {
      let aValue, bValue;

      // Special handling for opponent column
      if (sortConfig.key === "opponent") {
        aValue = a.opponent?.name?.toLowerCase() ?? "";
        bValue = b.opponent?.name?.toLowerCase() ?? "";
      } else {
        aValue = (a as any)[sortConfig.key];
        bValue = (b as any)[sortConfig.key];
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
  }, [validSeasonStats, sortConfig]);

  // Extract series IDs
  const seriesIds = team?.schedule || [];

  const fetchedSeriesMap = useAppSelector((state) =>
    state.series.get("fetchedSeriesIds")
  );

  // Fetch series data
  useEffect(() => {
    seriesIds.forEach((id) => {
      const hasBeenFetched = fetchedSeriesMap?.get(id) ?? false;
      if (!hasBeenFetched) {
        dispatch(fetchSeriesById(id, esportName));
      }
    });
  }, [dispatch, seriesIds, esportName, fetchedSeriesMap]);

  const seriesByIdMap = useAppSelector((state) =>
    state.series.get("seriesById")
  );

  // Collect series data
  const seriesList = useMemo(() => {
    const series = seriesIds
      .map((id) => seriesByIdMap.get(id))
      .filter((series): series is Series => series !== undefined);

    // Sort the series by start time, most recent first
    return [...series].sort((a, b) => {
      const aStart = new Date(a.start || 0).getTime();
      const bStart = new Date(b.start || 0).getTime();
      return bStart - aStart; // Sort descending (newest to oldest)
    });
  }, [seriesIds, seriesByIdMap]);

  // Conditional Returns After All Hooks
  if (!team && !loading) {
    return <div className="p-4">Team not found</div>;
  }

  if (loading) {
    return <div className="p-4">Loading team data...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger-500">{error}</div>;
  }

  if (!rosterId) {
    return <div className="p-4">No roster available</div>;
  }

  // Continue with the Rest of the Component Logic
  const { logoType, league } = getTeamData(team.name);

  const logoUrl =
    team.images && team.images.length > 0
      ? team.images[0].url
      : placeholderTeam;
  const countryFlag = team.region?.country?.images?.[0]?.url;

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return (
          <SvgIcon
            src={twitterIcon}
            className="h-5 w-5 text-gray-600 hover:text-blue-500"
          />
        );
      case "twitch":
        return (
          <SvgIcon
            src={twitchIcon}
            className="h-5 w-5 text-gray-600 hover:text-purple-500"
          />
        );
      case "youtube":
        return (
          <SvgIcon
            src={youtubeIcon}
            className="h-5 w-5 text-gray-600 hover:text-danger-500"
          />
        );
      default:
        return (
          <SvgIcon
            src={worldIcon}
            className="h-5 w-5 text-gray-600 hover:text-blue-500"
          />
        );
    }
  };

  // Access aggStats
  const aggStats = team.aggStats;

  // Define getLogoFilter function
  const getLogoFilter = (
    logoType: "black" | "white" | "color",
    isPlaceholder: boolean,
    currentTheme: string
  ): string => {
    if (isPlaceholder) {
      return "";
    }
    if (logoType === "black" && currentTheme === "dark") {
      return "invert";
    } else if (logoType === "white" && currentTheme === "light") {
      return "invert";
    }
    return "";
  };

  // Statistics configuration with properly typed keys
  const stats: StatEntry[] = [
    {
      label: "Gold",
      key: "averageGoldEarned",
      formatter: formatGold,
    },
    {
      label: "Kills",
      key: "averageScore",
      formatter: formatStat,
    },
    {
      label: "Towers",
      key: "averageTurretsDestroyed",
      formatter: formatStat,
    },
    {
      label: "Inhibitors",
      key: "averageInhibitorsDestroyed",
      formatter: formatStat,
    },
    {
      label: "Dragons",
      key: "averageDragonKills",
      formatter: formatStat,
    },
    {
      label: "Barons",
      key: "averageBaronKills",
      formatter: formatStat,
    },
    {
      label: "Heralds",
      key: "averageHeraldKills",
      formatter: formatStat,
    },
    {
      label: "Void Grubs",
      key: "averageVoidGrubKills",
      formatter: formatStat,
    },
  ];

  const seasonStatsColumns = [
    {
      label: "Date",
      key: "start",
      className: "text-center justify-center",
      render: (matchStat: TeamMatchStats) =>
        matchStat.start ? formatShortDate(matchStat.start) : "",
    },
    {
      label: "Opponent",
      key: "opponent",
      className: "text-left justify-start",
      render: (matchStat: TeamMatchStats) => {
        if (matchStat.opponent) {
          const opponentId = matchStat.opponent.id;
          const opponentName = matchStat.opponent.name;
          const opponentLogoUrl =
            matchStat.opponent.images && matchStat.opponent.images.length > 0
              ? matchStat.opponent.images[0].url
              : placeholderTeam;
          return (
            <Link
              to={`/esports/${esportName}/team/${opponentId}`}
              className="flex items-center space-x-2"
            >
              <img
                src={opponentLogoUrl}
                alt={`${opponentName} logo`}
                className="w-6 h-6 object-contain"
              />
              <div className="w-24">
                <AutoFitText
                  text={matchStat.opponent.name}
                  maxFontSize={16}
                  minFontSize={10}
                  maxLines={1}
                  textAlign="left"
                  className="font-bold"
                />
              </div>
            </Link>
          );
        } else {
          return "Unknown";
        }
      },
    },
    {
      label: "Result",
      key: "isWinner",
      className: "text-center justify-center",
      render: (matchStat: TeamMatchStats) => (
        <span
          className={
            matchStat.isWinner ? "text-success-400" : "text-danger-400"
          }
        >
          {matchStat.isWinner ? "Win" : "Loss"}
        </span>
      ),
    },
    {
      label: "Kills",
      key: "score",
      className: "text-center justify-center",
    },
    {
      label: "Gold",
      key: "goldEarned",
      className: "text-center justify-center",
      render: (matchStat: TeamMatchStats) => formatGold(matchStat.goldEarned),
    },
    {
      label: "Towers",
      key: "turretsDestroyed",
      className: "text-center justify-center",
    },
  ];

  // Render Tab Content
  const renderTabContent = () => {
    switch (selectedTab) {
      case "stats":
        return (
          <>
            {/* Statistics Section */}
            {aggStats ? (
              <div className="flex flex-wrap justify-center space-x-4 pb-4">
                {stats.map(({ label, key, formatter }) => (
                  <div
                    key={label}
                    className="flex-1 min-w-[80px] max-w-[120px] flex-shrink flex-grow"
                  >
                    <div className="block pt-4 transition-all duration-200">
                      <div className="bg-primary-200 dark:bg-secondary-500 rounded-lg p-2 shadow-sm transition-all duration-200 flex flex-col items-center space-y-2">
                        <div className="text-sm text-gray-500 font-bold text-center uppercase">
                          {label}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {formatter(aggStats[key] || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Season Stats Section */}
            {validSeasonStats.length > 0 ? (
              <div className="mb-4">
                <StatsTable<TeamMatchStats>
                  columns={seasonStatsColumns}
                  data={sortedSeasonStats}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  gridTemplateColumns={`repeat(${seasonStatsColumns.length}, 1fr)`}
                  rowKey={(matchStat, index) => index}
                  renderRow={(matchStat) => (
                    <div
                      key={matchStat.matchId}
                      className={`grid gap-0 p-2 bg-primary-200 dark:bg-secondary-500 rounded-md mb-1 shadow`}
                      style={{
                        gridTemplateColumns: `repeat(${seasonStatsColumns.length}, 1fr)`,
                      }}
                    >
                      {seasonStatsColumns.map((column) => {
                        const value = column.render
                          ? column.render(matchStat)
                          : (matchStat as any)[column.key] || "-";
                        return (
                          <div
                            key={column.key}
                            className={`flex items-center ${column.className}`}
                          >
                            <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            ) : (
              <p>No season stats available</p>
            )}
          </>
        );
      case "schedule":
        return (
          <>
            {/* Series History Section */}
            <Card>
              <CardBody className="bg-primary-100 dark:bg-secondary-700 rounded-md">
                {seriesList && seriesList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-3">
                    {seriesList.map((seriesItem) => {
                      const { id, lifecycle } = seriesItem;
                      const ScoreboardComponent =
                        lifecycle === "live"
                          ? LolLiveScoreboard
                          : LolScoreboard;

                      return (
                        <Link
                          key={id}
                          to={`/esports${esportName}/series/${id}`}
                          className="block p-0 m-0 transform transition-transform duration-200 ease-in-out hover:scale-101"
                          style={{ width: "100%", textDecoration: "none" }}
                        >
                          <ScoreboardComponent seriesId={id} />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    {seriesIds.length > 0
                      ? "Loading series history..."
                      : "No series history available"}
                  </p>
                )}
              </CardBody>
            </Card>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Column
      label=""
      backHref={`/esports/${esportName}`}
      className="max-w-6xl mx-auto"
    >
      <div className="space-y-6 p-4">
        {/* Header Section with Team Info and Basic Stats */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Team Info Card */}
          <Card className="flex-1">
            <CardBody className="bg-primary-100 dark:bg-secondary-700 rounded-md">
              <div className="flex items-start">
                {/* Logo */}
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt={`${team.name} logo`}
                    className={`w-full h-full object-contain ${getLogoFilter(
                      logoType,
                      logoUrl === placeholderTeam,
                      theme
                    )}`}
                  />
                </div>
                {/* Info */}
                <div className="flex flex-col space-y-2 ml-4 flex-1">
                  {/* Team Name and Abbreviation on the same line */}
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        {team.name}
                      </span>
                      {team.abbreviation && (
                        <span className="text-gray-500">
                          ({team.abbreviation})
                        </span>
                      )}
                    </div>
                    {/* Record */}
                    {aggStats && (
                      <span>
                        <span className="text-lg text-black dark:text-white">
                          {aggStats.totalSeriesWins}-
                          {aggStats.totalSeriesLosses}
                        </span>{" "}
                        <span className="text-lg text-gray-700 dark:text-gray-300">
                          ({aggStats.totalWins}-{aggStats.totalLosses})
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Country and League Information */}
                  {team.region?.country && (
                    <div className="flex items-center space-x-2">
                      {countryFlag && (
                        <img
                          src={countryFlag}
                          alt={`${team.region.country.name} flag`}
                          className="w-6 h-4 object-cover"
                        />
                      )}
                      <span>{team.region.country.name}</span>
                      {league && (
                        <span className="text-gray-500">| {league}</span>
                      )}
                    </div>
                  )}
                  {/* Social Media */}
                  {team.socialMediaAccounts &&
                    team.socialMediaAccounts.length > 0 && (
                      <div className="mt-2 flex space-x-4">
                        {team.socialMediaAccounts.map((account) => (
                          <a
                            key={account.url}
                            href={account.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {getSocialIcon(account.platform.name)}
                          </a>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Roster */}
          <Card className="flex-1 pr-6">
            <CardBody className="bg-primary-100 dark:bg-secondary-700 rounded-md">
              {rosterLoading && <p>Loading roster players...</p>}
              {rosterError && <p className="text-danger-500">{rosterError}</p>}
              {rosterPlayers.length > 0 ? (
                <div className="flex flex-wrap justify-between gap-2">
                  {rosterPlayers
                    .filter(
                      (player): player is Player =>
                        player !== undefined && player !== null
                    )
                    .sort((a, b) => {
                      const roleOrder = [
                        "Top",
                        "Jungle",
                        "Mid",
                        "Bot",
                        "Support",
                      ];
                      const normalizeRole = (role: string | undefined) =>
                        role
                          ? role.charAt(0).toUpperCase() +
                            role.slice(1).toLowerCase()
                          : "";
                      const roleA = normalizeRole(a.role);
                      const roleB = normalizeRole(b.role);
                      return (
                        roleOrder.indexOf(roleA) - roleOrder.indexOf(roleB)
                      );
                    })
                    .map((player) => (
                      <div
                        key={player.id}
                        className="flex-1 min-w-[80px] max-w-[120px] flex-shrink flex-grow"
                      >
                        <PlayerPreview
                          player={{
                            ...player,
                            role: player.role
                              ? player.role.charAt(0).toUpperCase() +
                                player.role.slice(1).toLowerCase()
                              : "",
                          }}
                          esportName={esportName}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  {rosterLoading
                    ? "Loading players..."
                    : "No players available"}
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs items={tabItems} activeItem={selectedTab} />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </Column>
  );
};

export default TeamDetail;

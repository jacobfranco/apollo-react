import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { fetchPlayerById } from "src/actions/players";
import { fetchTeamById } from "src/actions/teams";
import { fetchSeriesById } from "src/actions/series";
import {
  selectPlayerById,
  selectPlayersLoading,
  selectPlayersError,
  selectTeamById,
  selectTeamLoading,
  selectTeamError,
} from "src/selectors";
import { Column } from "src/components/Column";
import { Card, CardBody } from "src/components/Card";
import { Tabs } from "src/components";
import SvgIcon from "src/components/SvgIcon";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { useTheme } from "src/hooks/useTheme";
import { formatStat } from "src/utils/esports";
import { formatShortDate } from "src/utils/dates";
import StatsTable from "src/components/StatsTable";
import LolLiveScoreboard from "src/components/LolLiveScoreboard";
import LolScoreboard from "src/components/LolScoreboard";
import { Series } from "src/schemas/series";

type PlayerDetailParams = {
  esportName: string;
  playerId: string;
};

const PlayerDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName, playerId } = useParams<PlayerDetailParams>();
  const playerIdNumber = Number(playerId);
  const theme = useTheme();

  const player = useAppSelector((state) =>
    selectPlayerById(state, playerIdNumber)
  );
  const loading = useAppSelector((state) => selectPlayersLoading(state));
  const error = useAppSelector((state) => selectPlayersError(state));

  const primaryTeamId =
    player?.teamIds && player.teamIds.length > 0
      ? player.teamIds[0]
      : undefined;

  const team = useAppSelector((state) =>
    primaryTeamId ? selectTeamById(state, primaryTeamId) : undefined
  );
  const teamLoading = useAppSelector((state) =>
    primaryTeamId ? selectTeamLoading(state, primaryTeamId) : false
  );
  const teamError = useAppSelector((state) =>
    primaryTeamId ? selectTeamError(state, primaryTeamId) : undefined
  );

  const [selectedTab, setSelectedTab] = useState("stats");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "start",
    direction: "desc",
  });

  // Fetch player data on mount
  useEffect(() => {
    dispatch(fetchPlayerById(esportName, playerIdNumber));
  }, [dispatch, playerIdNumber, esportName]);

  // Fetch team data once player is loaded
  useEffect(() => {
    if (player && primaryTeamId && !team && !teamLoading) {
      dispatch(fetchTeamById(esportName, primaryTeamId));
    }
  }, [dispatch, esportName, primaryTeamId, player, team, teamLoading]);

  const seriesIds = team?.schedule || [];
  // Fetch series once team is loaded
  useEffect(() => {
    if (team && seriesIds.length > 0) {
      seriesIds.forEach((id) => {
        dispatch(fetchSeriesById(id, esportName));
      });
    }
  }, [dispatch, team, esportName, seriesIds]);

  const seriesByIdMap = useAppSelector((state) =>
    state.series.get("seriesById")
  );
  const seriesList: Series[] = useMemo(() => {
    return seriesIds
      .map((id) => seriesByIdMap.get(id))
      .filter(
        (series: Series | undefined): series is Series => series !== undefined
      );
  }, [seriesIds, seriesByIdMap]);

  const validSeasonStats = useMemo(() => {
    const seasonStats = player?.lolSeasonStats ?? [];
    return seasonStats.filter((matchStat: any) => matchStat != null);
  }, [player?.lolSeasonStats]);

  // Normalize stats to extract totals if they are objects
  const normalizedSeasonStats = useMemo(() => {
    return validSeasonStats.map((stat: any) => {
      const kills =
        stat.kills && typeof stat.kills === "object" && stat.kills.total != null
          ? stat.kills.total
          : stat.kills ?? 0;

      const deaths =
        stat.deaths &&
        typeof stat.deaths === "object" &&
        stat.deaths.total != null
          ? stat.deaths.total
          : stat.deaths ?? 0;

      const assists =
        stat.assists &&
        typeof stat.assists === "object" &&
        stat.assists.total != null
          ? stat.assists.total
          : stat.assists ?? 0;

      // Attempt to handle CS similarly
      let totalCreepScore = 0;
      if (
        stat.totalCreepScore &&
        typeof stat.totalCreepScore === "object" &&
        stat.totalCreepScore.total != null
      ) {
        totalCreepScore = stat.totalCreepScore.total;
      } else if (typeof stat.totalCreepScore === "number") {
        totalCreepScore = stat.totalCreepScore;
      } else if (stat.creeps && stat.creeps.total != null) {
        // fallback if creeps is present
        totalCreepScore = stat.creeps.total;
      }

      return {
        ...stat,
        kills,
        deaths,
        assists,
        totalCreepScore,
      };
    });
  }, [validSeasonStats]);

  const sortedSeasonStats = useMemo(() => {
    if (!sortConfig || normalizedSeasonStats.length === 0)
      return normalizedSeasonStats;
    return [...normalizedSeasonStats].sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [normalizedSeasonStats, sortConfig]);

  if (loading || !player) {
    return <div className="p-4">Loading player data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{String(error)}</div>;
  }

  const logoUrl =
    player.images && player.images.length > 0
      ? player.images[0].url
      : placeholderTeam;
  const countryFlag = player.region?.country?.images?.[0]?.url;

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return (
          <SvgIcon
            src={require("@tabler/icons/outline/brand-twitter.svg")}
            className="h-5 w-5 text-gray-600 hover:text-blue-500"
          />
        );
      case "twitch":
        return (
          <SvgIcon
            src={require("@tabler/icons/outline/brand-twitch.svg")}
            className="h-5 w-5 text-gray-600 hover:text-purple-500"
          />
        );
      case "youtube":
        return (
          <SvgIcon
            src={require("@tabler/icons/outline/brand-youtube.svg")}
            className="h-5 w-5 text-gray-600 hover:text-red-500"
          />
        );
      default:
        return (
          <SvgIcon
            src={require("@tabler/icons/outline/world.svg")}
            className="h-5 w-5 text-gray-600 hover:text-blue-500"
          />
        );
    }
  };

  const aggStats = player.aggStats;

  const handleSort = (key: string) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === key) {
        return {
          key,
          direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "desc" };
    });
  };

  const getStatValue = (statKey: string): number => {
    const val = (aggStats as any)?.[statKey];
    if (val == null) return 0;
    return typeof val === "object" && val.total != null
      ? val.total
      : Number(val);
  };

  // Compute aggregator KDA
  const averageKills = getStatValue("averageKills");
  const averageDeaths = getStatValue("averageDeaths");
  const averageAssists = getStatValue("averageAssists");
  const aggKDA = (averageKills + averageAssists) / Math.max(1, averageDeaths);

  const stats = aggStats
    ? [
        {
          label: "Matches",
          value: getStatValue("totalMatches"),
          formatter: formatStat,
        },
        {
          label: "Kills",
          value: averageKills,
          formatter: formatStat,
        },
        {
          label: "Deaths",
          value: averageDeaths,
          formatter: formatStat,
        },
        {
          label: "Assists",
          value: averageAssists,
          formatter: formatStat,
        },
        {
          label: "KDA",
          value: aggKDA,
          formatter: (val: number) => val.toFixed(2),
        },
        {
          label: "CS",
          value: getStatValue("averageCreepScore"),
          formatter: formatStat,
        },
      ]
    : [];

  // KDA column for each match
  // Build column shows items, trinket, keystone
  const seasonStatsColumns = [
    {
      label: "Date",
      key: "start",
      className: "text-center justify-center",
      render: (matchStat: any) =>
        matchStat.start ? formatShortDate(matchStat.start) : "",
    },
    {
      label: "Champion",
      key: "champion",
      className: "text-center justify-center",
      render: (matchStat: any) =>
        matchStat.champion?.champ?.name
          ? matchStat.champion.champ.name
          : "Unknown",
    },
    { label: "Kills", key: "kills", className: "text-center justify-center" },
    { label: "Deaths", key: "deaths", className: "text-center justify-center" },
    {
      label: "Assists",
      key: "assists",
      className: "text-center justify-center",
    },
    {
      label: "KDA",
      key: "kda",
      className: "text-center justify-center",
      render: (matchStat: any) => {
        const k = matchStat.kills || 0;
        const d = matchStat.deaths || 0;
        const a = matchStat.assists || 0;
        const kdaVal = (k + a) / Math.max(1, d);
        return kdaVal.toFixed(2);
      },
    },
    {
      label: "CS",
      key: "totalCreepScore",
      className: "text-center justify-center",
    },
    {
      label: "Build",
      key: "build",
      className: "text-center justify-center",
      render: (matchStat: any) => {
        const items = Array.isArray(matchStat.items) ? matchStat.items : [];
        const trinkets = Array.isArray(matchStat.trinketSlot)
          ? matchStat.trinketSlot
          : [];
        const keystoneObj = matchStat.keystone?.keystone;
        const keystoneImage =
          keystoneObj?.images &&
          Array.isArray(keystoneObj.images) &&
          keystoneObj.images.length > 0
            ? keystoneObj.images[0].thumbnail
            : null;

        // Extract item images
        const itemImages = items
          .map((it: any) => it.item?.images?.[0]?.thumbnail)
          .filter((img: string | undefined) => Boolean(img));

        // Extract trinket images
        const trinketImages = trinkets
          .map((it: any) => it.item?.images?.[0]?.thumbnail)
          .filter((img: string | undefined) => Boolean(img));

        return (
          <div className="flex flex-wrap items-center justify-center gap-1">
            {keystoneImage && (
              <img src={keystoneImage} alt="keystone" className="w-6 h-6" />
            )}
            {itemImages.map((img: string, idx: number) => (
              <img
                key={`item-${idx}`}
                src={img}
                alt="item"
                className="w-6 h-6"
              />
            ))}
            {trinketImages.map((img: string, idx: number) => (
              <img
                key={`trinket-${idx}`}
                src={img}
                alt="trinket"
                className="w-6 h-6"
              />
            ))}
          </div>
        );
      },
    },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "stats":
        return (
          <>
            {aggStats ? (
              <div className="flex flex-col space-y-6">
                {/* Aggregate Stats */}
                <div className="flex flex-wrap justify-center space-x-4 pb-4">
                  {stats.map(({ label, value, formatter }) => (
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
                              {formatter(value)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Season Stats Table */}
                {normalizedSeasonStats.length > 0 ? (
                  <div className="mb-4">
                    <StatsTable<any>
                      columns={seasonStatsColumns}
                      data={sortedSeasonStats}
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      gridTemplateColumns={`repeat(${seasonStatsColumns.length}, 1fr)`}
                      rowKey={(matchStat: any, index: number) => index}
                      renderRow={(matchStat: any) => (
                        <div
                          key={matchStat.matchId}
                          className={`grid gap-0 p-2 bg-primary-200 dark:bg-secondary-500 rounded-md mb-1 shadow`}
                          style={{
                            gridTemplateColumns: `repeat(${seasonStatsColumns.length}, 1fr)`,
                          }}
                        >
                          {seasonStatsColumns.map((column) => {
                            const rawValue = column.render
                              ? column.render(matchStat)
                              : matchStat[column.key] ?? "-";

                            // If rawValue is an object (and not null/array), show "-"
                            let displayValue: string | number | JSX.Element =
                              rawValue;
                            if (
                              typeof rawValue === "object" &&
                              rawValue !== null &&
                              !Array.isArray(rawValue)
                            ) {
                              displayValue = "-";
                            }

                            return (
                              <div
                                key={column.key}
                                className={`flex items-center ${column.className}`}
                              >
                                <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                                  {displayValue}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  </div>
                ) : (
                  <p>No match stats available</p>
                )}
              </div>
            ) : (
              <p>No aggregate stats available</p>
            )}
          </>
        );
      case "schedule":
        if (!primaryTeamId || !team) {
          return (
            <Card>
              <CardBody className="bg-primary-100 dark:bg-secondary-700 rounded-md">
                <p className="text-gray-500">
                  {teamLoading
                    ? "Loading team schedule..."
                    : teamError
                    ? String(teamError)
                    : "No schedule available"}
                </p>
              </CardBody>
            </Card>
          );
        }

        return (
          <Card>
            <CardBody className="bg-primary-100 dark:bg-secondary-700 rounded-md">
              {seriesList && seriesList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-3">
                  {seriesList.map((seriesItem) => {
                    const { id, lifecycle } = seriesItem;
                    const ScoreboardComponent =
                      lifecycle === "live" ? LolLiveScoreboard : LolScoreboard;

                    return (
                      <Link
                        key={id}
                        to={`/esports/${esportName}/series/${id}`}
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
        );
      default:
        return null;
    }
  };

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

  // Team abbreviation and logo
  const teamLogoUrl =
    team && team.images && team.images.length > 0 ? team.images[0].url : null;

  return (
    <Column
      label=""
      backHref={`/esports/${esportName}`}
      className="max-w-6xl mx-auto"
    >
      <div className="space-y-6 p-4">
        {/* Player Info Card */}
        <Card className="flex-1">
          <CardBody className="bg-primary-100 dark:bg-secondary-700 rounded-md">
            <div className="flex items-start">
              {/* Player Image */}
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={logoUrl}
                  alt={`${player.nickName} image`}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Info */}
              <div className="flex flex-col space-y-2 ml-4 flex-1">
                {/* Player Nickname (Role) */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    {player.nickName}
                  </span>
                  {player.role && (
                    <span className="text-gray-500">({player.role})</span>
                  )}
                </div>

                {/* Real Name */}
                <div className="text-gray-600 dark:text-gray-400">
                  {player.firstName} {player.lastName}
                </div>

                {/* Country */}
                {player.region?.country && (
                  <div className="flex items-center space-x-2">
                    {countryFlag && (
                      <img
                        src={countryFlag}
                        alt={`${player.region.country.name} flag`}
                        className="w-6 h-4 object-cover"
                      />
                    )}
                    <span>{player.region.country.name}</span>
                  </div>
                )}

                {/* Team Abbreviation and Logo */}
                {team && (
                  <div className="flex items-center space-x-2">
                    {teamLogoUrl && (
                      <img
                        src={teamLogoUrl}
                        alt={`${team.name} logo`}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    {team.abbreviation && (
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {team.abbreviation}
                      </span>
                    )}
                  </div>
                )}

                {/* Social Media */}
                {player.socialMediaAccounts &&
                  player.socialMediaAccounts.length > 0 && (
                    <div className="mt-2 flex space-x-4">
                      {player.socialMediaAccounts.map((account) => (
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

        {/* Tabs Section */}
        <Tabs items={tabItems} activeItem={selectedTab} />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </Column>
  );
};

export default PlayerDetail;

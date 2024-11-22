import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { fetchTeams } from "src/actions/teams";
import {
  selectTeamsList,
  selectTeamsLoading,
  selectTeamsError,
} from "src/selectors";
import { Team } from "src/schemas/team";
import { TeamAggStats } from "src/schemas/team-agg-stats";
import LolTeamRow from "src/components/LolTeamRow";
import { openModal, closeModal } from "src/actions/modals";
import { teamData } from "src/teams";

type SortKey =
  | "name"
  | "seriesRecord"
  | "totalWins"
  | "totalLosses"
  | "winRate"
  | "currentWinStreak"
  | "averageGoldEarned"
  | "averageScore"
  | "averageTurretsDestroyed"
  | "averageInhibitorsDestroyed"
  | "averageDragonKills"
  | "averageBaronKills"
  | "averageHeraldKills"
  | "averageVoidGrubKills";

const TeamsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();

  const teams = useAppSelector(selectTeamsList);
  const loading = useAppSelector(selectTeamsLoading);
  const error = useAppSelector(selectTeamsError);

  // Initialize sortConfig to sort by seriesRecord in descending order
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "seriesRecord",
    direction: "desc",
  });

  // State to toggle between basic and advanced stats
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  // State to toggle between combined and separated views
  const [isCombined, setIsCombined] = useState(true);

  // State for selected leagues
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  useEffect(() => {
    if (esportName) {
      dispatch(fetchTeams(esportName));
    }
  }, [dispatch, esportName]);

  // Define the columns for basic and advanced stats
  const basicColumns: Array<{ label: string; key: SortKey }> = [
    { label: "Team", key: "name" },
    { label: "Record", key: "seriesRecord" },
    { label: "Wins", key: "totalWins" },
    { label: "Losses", key: "totalLosses" },
    { label: "WR%", key: "winRate" },
    { label: "Streak", key: "currentWinStreak" },
  ];

  const advancedColumns: Array<{ label: string; key: SortKey }> = [
    { label: "Team", key: "name" },
    { label: "Gold", key: "averageGoldEarned" },
    { label: "Kills", key: "averageScore" },
    { label: "Towers", key: "averageTurretsDestroyed" },
    { label: "Inhibs", key: "averageInhibitorsDestroyed" },
    { label: "Barons", key: "averageBaronKills" },
    { label: "Dragons", key: "averageDragonKills" },
    { label: "Heralds", key: "averageHeraldKills" },
    { label: "Voidgrubs", key: "averageVoidGrubKills" },
  ];

  const columns = showAdvancedStats ? advancedColumns : basicColumns;

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc";
    if (sortConfig && sortConfig.key === key) {
      // Toggle direction
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    } else {
      // Start with 'asc' for 'name', 'desc' for others
      direction = key === "name" ? "asc" : "desc";
    }
    setSortConfig({ key, direction });
  };

  // Map over teams to assign league from teamData
  const teamsWithLeague = teams.map((team) => {
    const teamInfo = teamData[team.name];
    return {
      ...team,
      league: teamInfo?.league ?? "Unknown",
    };
  });

  // Filter teams based on selected leagues
  const filteredTeams = teamsWithLeague.filter((team) => {
    if (selectedLeagues.length === 0) return true;

    const teamLeague = team.league;
    const matchesLeague = teamLeague && selectedLeagues.includes(teamLeague);

    return matchesLeague;
  });

  // Group teams by league
  const teamsByLeague = filteredTeams.reduce((acc, team) => {
    const league = team.league || "Unknown";
    if (!acc[league]) {
      acc[league] = [];
    }
    acc[league].push(team);
    return acc;
  }, {} as { [league: string]: Team[] });

  const getSortedTeams = (teamsToSort: Team[]) => {
    if (!sortConfig) return teamsToSort;

    return [...teamsToSort].sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortConfig.key === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortConfig.key === "seriesRecord") {
        const aSeriesWins = a.aggStats?.totalSeriesWins ?? 0;
        const aSeriesLosses = a.aggStats?.totalSeriesLosses ?? 0;
        const bSeriesWins = b.aggStats?.totalSeriesWins ?? 0;
        const bSeriesLosses = b.aggStats?.totalSeriesLosses ?? 0;
        const aSeriesWinRate =
          aSeriesWins + aSeriesLosses > 0
            ? aSeriesWins / (aSeriesWins + aSeriesLosses)
            : 0;
        const bSeriesWinRate =
          bSeriesWins + bSeriesLosses > 0
            ? bSeriesWins / (bSeriesWins + bSeriesLosses)
            : 0;
        aValue = aSeriesWinRate;
        bValue = bSeriesWinRate;
      } else if (sortConfig.key === "totalWins") {
        aValue = a.aggStats?.totalWins ?? 0;
        bValue = b.aggStats?.totalWins ?? 0;
      } else if (sortConfig.key === "totalLosses") {
        aValue = a.aggStats?.totalLosses ?? 0;
        bValue = b.aggStats?.totalLosses ?? 0;
      } else if (sortConfig.key === "winRate") {
        const aWinRate = a.aggStats?.totalMatches
          ? a.aggStats.totalWins / a.aggStats.totalMatches
          : 0;
        const bWinRate = b.aggStats?.totalMatches
          ? b.aggStats.totalWins / b.aggStats.totalMatches
          : 0;
        aValue = aWinRate;
        bValue = bWinRate;
      } else if (sortConfig.key === "currentWinStreak") {
        aValue = a.aggStats?.currentWinStreak ?? 0;
        bValue = b.aggStats?.currentWinStreak ?? 0;
      } else {
        const statKey = sortConfig.key as keyof TeamAggStats;
        aValue = a.aggStats ? a.aggStats[statKey] ?? 0 : 0;
        bValue = b.aggStats ? b.aggStats[statKey] ?? 0 : 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  if (loading) {
    return <div className="text-center">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Calculate grid template columns with fixed first column
  const gridTemplateColumns = `200px repeat(${columns.length - 1}, 1fr)`;

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="flex justify-between mb-2">
        <div>
          <button
            onClick={() => setIsCombined((prev) => !prev)}
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 mr-2"
          >
            {isCombined ? "Separate by League" : "Combine All Teams"}
          </button>
          <button
            onClick={() =>
              dispatch(
                openModal("REGION_FILTER", {
                  onApplyFilter: (leagues: string[]) => {
                    setSelectedLeagues(leagues);
                    dispatch(closeModal());
                  },
                })
              )
            }
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
          >
            Filter
          </button>
        </div>
        <button
          onClick={() => setShowAdvancedStats((prev) => !prev)}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          {showAdvancedStats ? "Show Standings" : "Show Stats"}
        </button>
      </div>

      {/* Render Teams */}
      {isCombined ? (
        <>
          {/* Sorting Controls */}
          <div className={`grid gap-0`} style={{ gridTemplateColumns }}>
            {columns.map((column) => (
              <button
                key={column.key}
                onClick={() => handleSort(column.key as SortKey)}
                className="flex items-center justify-center w-full px-2 py-1 bg-primary-200 dark:bg-secondary-500 text-black dark:text-white font-semibold hover:bg-primary-300"
              >
                <span className="text-sm font-bold">{column.label}</span>
                <span className="ml-1 text-xs">
                  {sortConfig?.key === column.key ? (
                    sortConfig.direction === "asc" ? (
                      // Up Arrow
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      // Down Arrow
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )
                  ) : (
                    // Dash as placeholder
                    <span className="text-xs font-thin">—</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Padding between sort buttons and team rows */}
          <div className="my-2"></div>

          {/* Team Rows */}
          {getSortedTeams(filteredTeams).map((team) => (
            <LolTeamRow
              key={team.id}
              team={team}
              columns={columns}
              gridTemplateColumns={gridTemplateColumns}
            />
          ))}
        </>
      ) : (
        <>
          {Object.entries(teamsByLeague).map(([league, teamsInLeague]) => (
            <div key={league} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{league}</h2>

              {/* Sorting Controls */}
              <div className={`grid gap-0`} style={{ gridTemplateColumns }}>
                {columns.map((column) => (
                  <button
                    key={column.key}
                    onClick={() => handleSort(column.key as SortKey)}
                    className="flex items-center justify-center w-full px-2 py-1 bg-primary-200 dark:bg-secondary-500 text-black dark:text-white font-semibold hover:bg-primary-300"
                  >
                    <span className="text-sm font-bold">{column.label}</span>
                    <span className="ml-1 text-xs">
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          // Up Arrow
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : (
                          // Down Arrow
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )
                      ) : (
                        // Dash as placeholder
                        <span className="text-xs font-thin">—</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {/* Padding between sort buttons and team rows */}
              <div className="my-2"></div>

              {/* Team Rows */}
              {getSortedTeams(teamsInLeague).map((team) => (
                <LolTeamRow
                  key={team.id}
                  team={team}
                  columns={columns}
                  gridTemplateColumns={gridTemplateColumns}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TeamsTab;

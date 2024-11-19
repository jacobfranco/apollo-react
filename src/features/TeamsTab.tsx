// src/components/TeamsTab.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { fetchTeams } from "src/actions/teams";
import {
  selectTeamsList,
  selectTeamsLoading,
  selectTeamsError,
} from "src/selectors";
import { TeamAggStats } from "src/schemas/team-agg-stats";
import LolTeamRow from "src/components/LolTeamRow";

type SortKey =
  | "name"
  | "totalMatches"
  | "totalWins"
  | "totalLosses"
  | "winRate"
  | "currentWinStreak"
  | "averageGoldEarned"
  | "averageScore"
  | "averageTurretsDestroyed"
  | "averageInhibitorsDestroyed";

const TeamsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();

  const teams = useAppSelector(selectTeamsList);
  const loading = useAppSelector(selectTeamsLoading);
  const error = useAppSelector(selectTeamsError);

  // Initialize sortConfig to sort by winRate in descending order
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "winRate",
    direction: "desc",
  });

  useEffect(() => {
    if (esportName) {
      dispatch(fetchTeams(esportName));
    }
  }, [dispatch, esportName]);

  const columns: Array<{ label: string; key: SortKey }> = [
    { label: "Team", key: "name" },
    { label: "Wins", key: "totalWins" },
    { label: "Losses", key: "totalLosses" },
    { label: "WR%", key: "winRate" },
    { label: "Streak", key: "currentWinStreak" },
    { label: "Gold", key: "averageGoldEarned" },
    { label: "Kills", key: "averageScore" },
    { label: "Towers", key: "averageTurretsDestroyed" },
    { label: "Inhibs", key: "averageInhibitorsDestroyed" },
  ];

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

  const sortedTeams = React.useMemo(() => {
    if (!sortConfig) return teams;

    return [...teams].sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortConfig.key === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortConfig.key === "winRate") {
        const aWinRate = a.aggStats?.totalMatches
          ? a.aggStats.totalWins / a.aggStats.totalMatches
          : 0;
        const bWinRate = b.aggStats?.totalMatches
          ? b.aggStats.totalWins / b.aggStats.totalMatches
          : 0;
        aValue = aWinRate;
        bValue = bWinRate;
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
  }, [teams, sortConfig]);

  if (loading) {
    return <div className="text-center">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Define the shared grid template
  const gridTemplateColumns = "grid-cols-[200px_repeat(8,1fr)]";

  return (
    <div>
      {/* Sorting Controls */}
      <div className={`grid ${gridTemplateColumns} gap-0`}>
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
      {sortedTeams.map((team) => (
        <LolTeamRow
          key={team.id}
          team={team}
          columns={columns}
          gridTemplateColumns={gridTemplateColumns}
        />
      ))}
    </div>
  );
};

export default TeamsTab;

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

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    if (esportName) {
      dispatch(fetchTeams(esportName));
    }
  }, [dispatch, esportName]);

  const columns: Array<{ label: string; key: SortKey }> = [
    { label: "Team", key: "name" },
    { label: "Matches", key: "totalMatches" },
    { label: "Wins", key: "totalWins" },
    { label: "Losses", key: "totalLosses" },
    { label: "WR%", key: "winRate" },
    { label: "Streak", key: "currentWinStreak" },
    { label: "Gold", key: "averageGoldEarned" },
    { label: "Kills", key: "averageScore" },
    { label: "Turrets", key: "averageTurretsDestroyed" },
    { label: "Inhibs", key: "averageInhibitorsDestroyed" },
  ];

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
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

  return (
    <div>
      {/* Sorting Controls */}
      <div className="grid grid-cols-[2fr_repeat(9,1fr)] gap-2">
        {columns.map((column) => (
          <div key={column.key} className="flex items-center justify-center">
            <button
              onClick={() => handleSort(column.key as SortKey)}
              className="w-full px-3 py-1 bg-primary-200 dark:bg-secondary-500 text-black dark:text-white font-bold rounded hover:bg-primary-300 flex items-center justify-center"
            >
              {column.label}
              {sortConfig?.key === column.key ? (
                sortConfig.direction === "asc" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
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
              ) : null}
            </button>
          </div>
        ))}
      </div>

      {/* Padding between sort buttons and team rows */}
      <div className="my-4"></div>

      {/* Team Rows */}
      {sortedTeams.map((team) => (
        <LolTeamRow key={team.id} team={team} columns={columns} />
      ))}
    </div>
  );
};

export default TeamsTab;

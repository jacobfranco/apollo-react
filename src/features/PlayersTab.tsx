import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { fetchPlayers } from "src/actions/players";
import {
  selectPlayersList,
  selectPlayersLoading,
  selectPlayersError,
} from "src/selectors";
import LolPlayerRow from "src/components/LolPlayerRow";

type SortKey =
  | "role"
  | "name"
  | "matches"
  | "wins"
  | "losses"
  | "winRate"
  | "kills"
  | "deaths"
  | "assists"
  | "kda"
  | "cs";

const PlayersTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();

  const players = useAppSelector(selectPlayersList);
  const loading = useAppSelector(selectPlayersLoading);
  const error = useAppSelector(selectPlayersError);

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    if (esportName) {
      dispatch(fetchPlayers(esportName));
    }
  }, [dispatch, esportName]);

  const columns: Array<{ label: string; key: SortKey }> = [
    { label: "Role", key: "role" },
    { label: "Player", key: "name" },
    { label: "Matches", key: "matches" },
    { label: "Wins", key: "wins" },
    { label: "Losses", key: "losses" },
    { label: "WR%", key: "winRate" },
    { label: "Kills", key: "kills" },
    { label: "Deaths", key: "deaths" },
    { label: "Assists", key: "assists" },
    { label: "KDA", key: "kda" },
    { label: "CS", key: "cs" },
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

  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig) return players;

    return [...players].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortConfig.key) {
        case "role":
          aValue = a.role?.toLowerCase();
          bValue = b.role?.toLowerCase();
          break;
        case "name":
          aValue = a.nickName.toLowerCase();
          bValue = b.nickName.toLowerCase();
          break;
        case "winRate":
          aValue = a.aggStats?.matches
            ? a.aggStats.wins / a.aggStats.matches
            : 0;
          bValue = b.aggStats?.matches
            ? b.aggStats.wins / b.aggStats.matches
            : 0;
          break;
        case "kda":
          const aKDA = a.aggStats
            ? (a.aggStats.kills + a.aggStats.assists) /
              Math.max(a.aggStats.deaths, 1)
            : 0;
          const bKDA = b.aggStats
            ? (b.aggStats.kills + b.aggStats.assists) /
              Math.max(b.aggStats.deaths, 1)
            : 0;
          aValue = aKDA;
          bValue = bKDA;
          break;
        default:
          aValue = a.aggStats ? a.aggStats[sortConfig.key] ?? 0 : 0;
          bValue = b.aggStats ? b.aggStats[sortConfig.key] ?? 0 : 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [players, sortConfig]);

  if (loading) {
    return <div className="text-center">Loading players...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      {/* Sorting Controls */}
      <div className="grid grid-cols-[1fr_2fr_repeat(9,1fr)] gap-2">
        {columns.map((column) => (
          <div key={column.key} className="flex items-center justify-center">
            <button
              onClick={() => handleSort(column.key)}
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

      {/* Padding between sort buttons and player rows */}
      <div className="my-4"></div>

      {/* Player Rows */}
      {sortedPlayers.map((player) => (
        <LolPlayerRow key={player.id} player={player} columns={columns} />
      ))}
    </div>
  );
};

export default PlayersTab;

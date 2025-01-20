import React, { useState, useMemo, useCallback, useEffect } from "react";
import Spinner from "src/components/Spinner";
import StatsTable from "src/components/StatsTable";
import LolPlayerRow from "src/components/LolPlayerRow";
import { useAppSelector } from "src/hooks";
import {
  selectPlayersList,
  selectPlayersLoading,
  selectPlayersError,
  selectTeamsList,
  selectTeamsLoading,
} from "src/selectors";
import { Player } from "src/schemas/player";
import { PlayerAggStats } from "src/schemas/player-agg-stats";
import { Team } from "src/schemas/team";
import esportsConfig from "src/esports-config";

type PlayersTabProps = {
  esportName: string;
};

interface PlayerWithComputedValues extends Player {
  computedValues: {
    teamLogo: string;
    teamName: string;
  };
}

const PlayersTab: React.FC<PlayersTabProps> = ({ esportName }) => {
  // Identify which game config
  const game = esportsConfig.find((g) => g.path === esportName);

  // Store selectors
  const players = useAppSelector(selectPlayersList);
  const playersLoading = useAppSelector(selectPlayersLoading);
  const playersError = useAppSelector(selectPlayersError);
  const teams = useAppSelector(selectTeamsList);
  const teamsLoading = useAppSelector(selectTeamsLoading);

  // Sorting config
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "kda", direction: "desc" });

  // Pagination config
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100; // adjust as needed

  // Define table columns
  const columns = useMemo(
    () => [
      { label: "Team", key: "teamName" },
      { label: "Player", key: "name" },
      { label: "Matches", key: "totalMatches" },
      { label: "KDA", key: "kda" },
      { label: "Kills", key: "averageKills" },
      { label: "Deaths", key: "averageDeaths" },
      { label: "Assists", key: "averageAssists" },
      { label: "CS", key: "averageCreepScore" },
    ],
    []
  );

  // Sort the players
  const sortedPlayers = useMemo<PlayerWithComputedValues[]>(() => {
    const validPlayers = players.filter((p) => p.aggStats && p.teamIds?.length);

    // Add computed team name/logo
    const enriched = validPlayers.map((player) => {
      const lastTeamId = player.teamIds![player.teamIds!.length - 1];
      const team = teams.find((t: Team) => t.id === lastTeamId);
      return {
        ...player,
        computedValues: {
          teamLogo: team?.images?.[0]?.url ?? "",
          teamName: team?.name ?? "Team",
        },
      };
    });

    // Perform sorting
    enriched.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.key) {
        case "teamName":
          comparison = a.computedValues.teamName.localeCompare(
            b.computedValues.teamName
          );
          break;
        case "name":
          comparison = (a.nickName || "").localeCompare(b.nickName || "");
          break;
        case "kda":
          comparison = (a.aggStats?.kda ?? 0) - (b.aggStats?.kda ?? 0);
          break;
        case "totalMatches":
          comparison =
            (a.aggStats?.totalMatches ?? 0) - (b.aggStats?.totalMatches ?? 0);
          break;
        default: {
          // For averageKills, averageAssists, etc.
          const skey = sortConfig.key as keyof PlayerAggStats;
          const aStat = a.aggStats?.[skey] ?? 0;
          const bStat = b.aggStats?.[skey] ?? 0;
          comparison = (aStat as number) - (bStat as number);
        }
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
    return enriched;
  }, [players, teams, sortConfig]);

  // Slice for pagination
  const paginatedPlayers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedPlayers.slice(startIndex, endIndex);
  }, [sortedPlayers, currentPage, pageSize]);

  // Handle sort
  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "desc" ? "asc" : "desc" }
        : { key, direction: "desc" }
    );
  }, []);

  // Grid template for the StatsTable
  const gridTemplateColumns = `100px repeat(${columns.length - 1}, 1fr)`;

  // Check loading/error states
  const isLoading = playersLoading || teamsLoading;
  const error = playersError;
  if (!game) {
    return (
      <div className="text-center text-danger-500">Invalid eSport name</div>
    );
  }
  if (error) {
    return <div className="text-center text-danger-500">Error: {error}</div>;
  }
  if (isLoading && players.length === 0) {
    return <Spinner />;
  }
  if (players.length === 0) {
    return <div className="text-center">No players found.</div>;
  }

  return (
    <div className="pt-2">
      {/* If still loading but we already have some data, show a small spinner above the table */}
      {isLoading && players.length > 0 && (
        <div className="mb-2 text-center">
          <Spinner />
        </div>
      )}

      <StatsTable<PlayerWithComputedValues>
        columns={columns}
        data={paginatedPlayers}
        sortConfig={sortConfig}
        onSort={handleSort}
        gridTemplateColumns={gridTemplateColumns}
        rowKey={(p) => p.id}
        renderRow={(p) => (
          <LolPlayerRow
            key={p.id}
            player={p}
            columns={columns}
            gridTemplateColumns={gridTemplateColumns}
            esportName={esportName}
          />
        )}
      />

      {/* Basic pagination controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-primary-500 text-secondary-500 rounded hover:bg-primary-600"
        >
          Previous
        </button>
        <span className="self-center">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={paginatedPlayers.length < pageSize}
          className="px-4 py-2 bg-primary-500 text-secondary-500 rounded hover:bg-primary-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PlayersTab;

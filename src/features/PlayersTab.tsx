// PlayersTab.tsx

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { fetchPlayers } from "src/actions/players";
import { fetchTeams } from "src/actions/teams";
import {
  selectPlayersList,
  selectPlayersLoading,
  selectPlayersError,
  selectTeamsById,
  selectTeamsList,
  selectTeamsLoading,
} from "src/selectors";
import { Player } from "src/schemas/player";
import { PlayerAggStats } from "src/schemas/player-agg-stats";
import Spinner from "src/components/Spinner";
import StatsTable from "src/components/StatsTable";
import LolPlayerRow from "src/components/LolPlayerRow";

interface PlayerWithComputedValues extends Player {
  computedValues: {
    kda: number;
    teamLogo: string;
  };
}

const PlayersTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();

  const players = useAppSelector(selectPlayersList);
  const loadingPlayers = useAppSelector(selectPlayersLoading);
  const errorPlayers = useAppSelector(selectPlayersError);
  const teams = useAppSelector(selectTeamsList);
  const teamsById = useAppSelector(selectTeamsById);
  const loadingTeams = useAppSelector(selectTeamsLoading);

  // Fetch players and teams if not loaded
  useEffect(() => {
    if (!esportName) return;
    if (players.length === 0 && !loadingPlayers) {
      dispatch(fetchPlayers(esportName));
    }
    if (teams.length === 0 && !loadingTeams) {
      dispatch(fetchTeams(esportName));
    }
  }, [dispatch, esportName, players, loadingPlayers, teams, loadingTeams]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "kda",
    direction: "desc",
  });

  // Define all hooks and derived values before any returns
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

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const aggStats = player.aggStats;
      if (!aggStats) return false;
      const { averageKills, averageDeaths, averageAssists, averageCreepScore } =
        aggStats;
      return (
        averageKills !== 0 ||
        averageDeaths !== 0 ||
        averageAssists !== 0 ||
        averageCreepScore !== 0
      );
    });
  }, [players]);

  const playersWithComputedValues = useMemo(() => {
    return filteredPlayers.map((player) => {
      const aggStats = player.aggStats!;
      const { averageKills, averageDeaths, averageAssists } = aggStats;
      const kda =
        averageDeaths === 0
          ? averageKills + averageAssists
          : (averageKills + averageAssists) / averageDeaths;

      const lastTeamId = player.teamIds?.[player.teamIds.length - 1];
      const team = lastTeamId ? teamsById.get(lastTeamId) : undefined;
      const teamLogo = team?.images?.[0]?.url ?? "";

      return {
        ...player,
        computedValues: {
          kda,
          teamLogo,
        },
      };
    });
  }, [filteredPlayers, teamsById]);

  const getSortedPlayers = useCallback(
    (playersToSort: PlayerWithComputedValues[]) => {
      if (!sortConfig) return playersToSort;

      return [...playersToSort].sort((a, b) => {
        let comparison = 0;
        if (sortConfig.key === "teamName") {
          // Sort by team logo string
          comparison = a.computedValues.teamLogo.localeCompare(
            b.computedValues.teamLogo
          );
        } else if (sortConfig.key === "name") {
          comparison = a.nickName.localeCompare(b.nickName);
        } else if (sortConfig.key === "kda") {
          comparison = a.computedValues.kda - b.computedValues.kda;
        } else if (sortConfig.key === "totalMatches") {
          comparison =
            (a.aggStats?.totalMatches ?? 0) - (b.aggStats?.totalMatches ?? 0);
        } else {
          const statKey = sortConfig.key as keyof PlayerAggStats;
          const aStat = a.aggStats?.[statKey] ?? 0;
          const bStat = b.aggStats?.[statKey] ?? 0;
          comparison = aStat - bStat;
        }
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    },
    [sortConfig]
  );

  const handleSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          key,
          direction: "desc",
        };
      }
    });
  }, []);

  // Now handle the conditional returns:
  if (loadingPlayers || loadingTeams) {
    return <Spinner withText={false} />;
  }

  if (errorPlayers) {
    return (
      <div className="text-center text-red-500">Error: {errorPlayers}</div>
    );
  }

  const sortedPlayers = getSortedPlayers(playersWithComputedValues);
  const gridTemplateColumns = `100px repeat(${columns.length - 1}, 1fr)`;

  return (
    <div>
      <StatsTable<PlayerWithComputedValues>
        columns={columns}
        data={sortedPlayers}
        sortConfig={sortConfig}
        onSort={handleSort}
        gridTemplateColumns={gridTemplateColumns}
        rowKey={(player) => player.id}
        renderRow={(player) => (
          <LolPlayerRow
            key={player.id}
            player={player}
            columns={columns}
            gridTemplateColumns={gridTemplateColumns}
            esportName={esportName}
          />
        )}
      />
    </div>
  );
};

export default PlayersTab;

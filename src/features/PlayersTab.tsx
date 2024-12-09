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

  // Track whether initial fetch has been attempted
  const [hasInitiatedFetch, setHasInitiatedFetch] = useState(false);

  // Improved data fetching logic
  useEffect(() => {
    if (!esportName || hasInitiatedFetch) return;

    const fetchData = async () => {
      setHasInitiatedFetch(true);
      await Promise.all([
        dispatch(fetchPlayers(esportName)),
        dispatch(fetchTeams(esportName)),
      ]);
    };

    fetchData();
  }, [dispatch, esportName, hasInitiatedFetch]);

  // Reset fetch flag when esportName changes
  useEffect(() => {
    setHasInitiatedFetch(false);
  }, [esportName]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "kda",
    direction: "desc",
  });

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

  // More permissive filtering that only removes clearly invalid entries
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const aggStats = player.aggStats;
      return aggStats && player.teamIds && player.teamIds.length > 0;
    });
  }, [players]);

  const playersWithComputedValues = useMemo(() => {
    return filteredPlayers.map((player) => {
      const aggStats = player.aggStats!;
      const {
        averageKills = 0,
        averageDeaths = 0,
        averageAssists = 0,
      } = aggStats;

      // Improved KDA calculation with safety checks
      const kda =
        averageDeaths === 0
          ? averageKills + averageAssists
          : Number(
              ((averageKills + averageAssists) / averageDeaths).toFixed(2)
            );

      const lastTeamId = player.teamIds?.[player.teamIds.length - 1];
      const team = lastTeamId ? teamsById.get(lastTeamId) : undefined;
      const teamLogo = team?.images?.[0]?.url ?? "";

      return {
        ...player,
        computedValues: {
          kda: isNaN(kda) ? 0 : kda,
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

        switch (sortConfig.key) {
          case "teamName":
            comparison = (a.computedValues.teamLogo || "").localeCompare(
              b.computedValues.teamLogo || ""
            );
            break;
          case "name":
            comparison = (a.nickName || "").localeCompare(b.nickName || "");
            break;
          case "kda":
            comparison =
              (a.computedValues.kda || 0) - (b.computedValues.kda || 0);
            break;
          case "totalMatches":
            comparison =
              (a.aggStats?.totalMatches || 0) - (b.aggStats?.totalMatches || 0);
            break;
          default:
            const statKey = sortConfig.key as keyof PlayerAggStats;
            const aStat = a.aggStats?.[statKey] || 0;
            const bStat = b.aggStats?.[statKey] || 0;
            comparison = (aStat as number) - (bStat as number);
        }

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    },
    [sortConfig]
  );

  const handleSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "desc"
          ? "asc"
          : "desc",
    }));
  }, []);

  // Enhanced loading state handling
  const isLoading = loadingPlayers || loadingTeams;
  const hasNoData = !isLoading && players.length === 0;
  const hasError = Boolean(errorPlayers);

  if (isLoading) {
    return <Spinner withText={false} />;
  }

  if (hasError) {
    return (
      <div className="text-center text-red-500">Error: {errorPlayers}</div>
    );
  }

  if (hasNoData) {
    return <div className="text-center">No player data available</div>;
  }

  const sortedPlayers = getSortedPlayers(playersWithComputedValues);
  const gridTemplateColumns = `100px repeat(${columns.length - 1}, 1fr)`;

  return (
    <div>
      {sortedPlayers.length === 0 ? (
        <div className="text-center">No players match the current criteria</div>
      ) : (
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
      )}
    </div>
  );
};

export default PlayersTab;

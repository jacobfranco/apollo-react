// PlayersTab.tsx

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { fetchPlayers } from "src/actions/players";
import {
  selectPlayersList,
  selectPlayersLoading,
  selectPlayersError,
} from "src/selectors";
import { Player } from "src/schemas/player";
import { PlayerAggStats } from "src/schemas/player-agg-stats";
import LolPlayerRow from "src/components/LolPlayerRow";
import Spinner from "src/components/Spinner";
import StatsTable from "src/components/StatsTable";

interface PlayerWithComputedValues extends Player {
  computedValues: {
    kda: number;
  };
}

const PlayersTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();

  const players = useAppSelector(selectPlayersList);
  const loading = useAppSelector(selectPlayersLoading);
  const error = useAppSelector(selectPlayersError);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "kda",
    direction: "desc",
  });

  useEffect(() => {
    if (esportName) {
      dispatch(fetchPlayers(esportName));
    }
  }, [dispatch, esportName]);

  // Define columns in the specified order
  const columns = useMemo(
    () => [
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

  // Filter out players with all zero stats
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const aggStats = player.aggStats;
      if (!aggStats) return false; // Exclude players without aggStats

      // Check if all relevant stats are zero
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

  // Compute KDA for each player
  const playersWithComputedValues = useMemo(() => {
    return filteredPlayers.map((player) => {
      const aggStats = player.aggStats!;
      let kda = 0;
      const { averageKills, averageDeaths, averageAssists } = aggStats;
      if (averageDeaths === 0) {
        kda = averageKills + averageAssists;
      } else {
        kda = (averageKills + averageAssists) / averageDeaths;
      }
      return {
        ...player,
        computedValues: {
          kda,
        },
      };
    });
  }, [filteredPlayers]);

  // Sorting function
  const getSortedPlayers = useCallback(
    (playersToSort: PlayerWithComputedValues[]) => {
      if (!sortConfig) return playersToSort;

      return [...playersToSort].sort((a, b) => {
        let comparison = 0;

        if (sortConfig.key === "name") {
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

  if (loading) {
    return <Spinner withText={false} />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const gridTemplateColumns = `200px repeat(${columns.length - 1}, 1fr)`;

  return (
    <div>
      <StatsTable<PlayerWithComputedValues>
        columns={columns}
        data={getSortedPlayers(playersWithComputedValues)}
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

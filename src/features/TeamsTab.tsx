// TeamsTab.tsx

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import { groupLeaguesByTier, teamData } from "src/teams";
import Spinner from "src/components/Spinner";
import StatsTable from "src/components/StatsTable";

// Cache for computed values
interface TeamWithComputedValues extends Team {
  league: string;
  computedValues: {
    seriesWinRate: number;
    winRate: number;
  };
}

const TeamsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();

  const teams = useAppSelector(selectTeamsList);
  const loading = useAppSelector(selectTeamsLoading);
  const error = useAppSelector(selectTeamsError);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "seriesRecord",
    direction: "desc",
  });

  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [isCombined, setIsCombined] = useState(false); // Changed default to false
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  useEffect(() => {
    if (esportName) {
      dispatch(fetchTeams(esportName));
    }
  }, [dispatch, esportName]);

  // Memoize columns configuration
  const columns = useMemo(() => {
    const basicColumns: Array<{ label: string; key: string }> = [
      { label: "Team", key: "name" },
      { label: "Record", key: "seriesRecord" },
      { label: "Wins", key: "totalWins" },
      { label: "Losses", key: "totalLosses" },
      { label: "WR%", key: "winRate" },
      { label: "Streak", key: "currentWinStreak" },
    ];

    const advancedColumns: Array<{ label: string; key: string }> = [
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

    return showAdvancedStats ? advancedColumns : basicColumns;
  }, [showAdvancedStats]);

  // Memoize teams with computed values
  const teamsWithComputedValues = useMemo((): TeamWithComputedValues[] => {
    return teams.map((team) => {
      const teamInfo = teamData[team.name];
      const seriesWins = team.aggStats?.totalSeriesWins ?? 0;
      const seriesLosses = team.aggStats?.totalSeriesLosses ?? 0;
      const totalSeriesGames = seriesWins + seriesLosses;

      const wins = team.aggStats?.totalWins ?? 0;
      const totalMatches = team.aggStats?.totalMatches ?? 0;

      return {
        ...team,
        league: teamInfo?.league ?? "Unknown",
        computedValues: {
          seriesWinRate:
            totalSeriesGames > 0 ? seriesWins / totalSeriesGames : 0,
          winRate: totalMatches > 0 ? wins / totalMatches : 0,
        },
      };
    });
  }, [teams]);

  // Memoize filtered teams
  const filteredTeams = useMemo(() => {
    if (selectedLeagues.length === 0) return teamsWithComputedValues;
    return teamsWithComputedValues.filter((team) =>
      selectedLeagues.includes(team.league)
    );
  }, [teamsWithComputedValues, selectedLeagues]);

  // Get ordered league list
  const orderedLeagues = useMemo(() => {
    const tiers = groupLeaguesByTier();
    // Flatten tiers into a single ordered array
    return [...tiers[1], ...tiers[2], ...tiers[3], ...tiers[4], ...tiers[5]];
  }, []);

  // Memoize teams by league with ordering
  const teamsByLeague = useMemo(() => {
    const leagueGroups = filteredTeams.reduce((acc, team) => {
      if (!acc[team.league]) {
        acc[team.league] = [];
      }
      acc[team.league].push(team);
      return acc;
    }, {} as { [league: string]: TeamWithComputedValues[] });

    // Create an ordered version of the groups
    return Object.fromEntries(
      orderedLeagues
        .filter((league) => leagueGroups[league])
        .map((league) => [league, leagueGroups[league]])
    );
  }, [filteredTeams, orderedLeagues]);

  // Memoize sort function
  const getSortedTeams = useCallback(
    (teamsToSort: TeamWithComputedValues[]) => {
      if (!sortConfig) return teamsToSort;

      return [...teamsToSort].sort((a, b) => {
        let comparison = 0;

        switch (sortConfig.key) {
          case "name":
            comparison = a.name
              .toLowerCase()
              .localeCompare(b.name.toLowerCase());
            break;
          case "seriesRecord":
            comparison =
              a.computedValues.seriesWinRate - b.computedValues.seriesWinRate;
            break;
          case "winRate":
            comparison = a.computedValues.winRate - b.computedValues.winRate;
            break;
          case "totalWins":
            comparison =
              (a.aggStats?.totalWins ?? 0) - (b.aggStats?.totalWins ?? 0);
            break;
          case "totalLosses":
            comparison =
              (a.aggStats?.totalLosses ?? 0) - (b.aggStats?.totalLosses ?? 0);
            break;
          case "currentWinStreak":
            comparison =
              (a.aggStats?.currentWinStreak ?? 0) -
              (b.aggStats?.currentWinStreak ?? 0);
            break;
          default:
            const statKey = sortConfig.key as keyof TeamAggStats;
            comparison =
              ((a.aggStats?.[statKey] ?? 0) as number) -
              ((b.aggStats?.[statKey] ?? 0) as number);
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

  const handleLeagueFilter = useCallback(
    (leagues: string[]) => {
      setSelectedLeagues(leagues);
      dispatch(closeModal());
    },
    [dispatch]
  );

  if (loading) {
    return <Spinner withText={false} />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const gridTemplateColumns = `225px repeat(${columns.length - 1}, 1fr)`;

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          onClick={() =>
            dispatch(
              openModal("LOL_REGION_FILTER", {
                onApplyFilter: handleLeagueFilter,
              })
            )
          }
          className="px-4 py-2 bg-primary-500 text-secondary-500 rounded hover:bg-primary-600 mr-2"
        >
          Filter
        </button>
        <button
          onClick={() => setIsCombined((prev) => !prev)}
          className="px-4 py-2 bg-primary-500 text-secondary-500 rounded hover:bg-primary-600 mr-2"
        >
          {isCombined ? "Separate by League" : "Combine All Teams"}
        </button>
        <button
          onClick={() => setShowAdvancedStats((prev) => !prev)}
          className="px-4 py-2 bg-primary-500 text-secondary-500 rounded hover:bg-primary-600"
        >
          {showAdvancedStats ? "Show Standings" : "Show Stats"}
        </button>
      </div>

      {isCombined ? (
        <StatsTable<TeamWithComputedValues>
          columns={columns}
          data={getSortedTeams(filteredTeams)}
          sortConfig={sortConfig}
          onSort={handleSort}
          gridTemplateColumns={gridTemplateColumns}
          rowKey={(team) => team.id}
          renderRow={(team) => (
            <LolTeamRow
              key={team.id}
              team={team}
              columns={columns}
              gridTemplateColumns={gridTemplateColumns}
              esportName={esportName}
            />
          )}
        />
      ) : (
        Object.entries(teamsByLeague).map(([league, teamsInLeague]) => (
          <div key={league} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{league}</h2>
            <StatsTable<TeamWithComputedValues>
              columns={columns}
              data={getSortedTeams(teamsInLeague)}
              sortConfig={sortConfig}
              onSort={handleSort}
              gridTemplateColumns={gridTemplateColumns}
              rowKey={(team) => team.id}
              renderRow={(team) => (
                <LolTeamRow
                  key={team.id}
                  team={team}
                  columns={columns}
                  gridTemplateColumns={gridTemplateColumns}
                  esportName={esportName}
                />
              )}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default TeamsTab;

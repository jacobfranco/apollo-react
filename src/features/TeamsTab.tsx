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
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "seriesRecord",
    direction: "desc",
  });

  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [isCombined, setIsCombined] = useState(true);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  useEffect(() => {
    if (esportName) {
      dispatch(fetchTeams(esportName));
    }
  }, [dispatch, esportName]);

  // Memoize columns configuration
  const columns = useMemo(() => {
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

  // Memoize teams by league
  const teamsByLeague = useMemo(() => {
    return filteredTeams.reduce((acc, team) => {
      if (!acc[team.league]) {
        acc[team.league] = [];
      }
      acc[team.league].push(team);
      return acc;
    }, {} as { [league: string]: TeamWithComputedValues[] });
  }, [filteredTeams]);

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

  const handleSort = useCallback((key: SortKey) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  const handleLeagueFilter = useCallback(
    (leagues: string[]) => {
      setSelectedLeagues(leagues);
      dispatch(closeModal());
    },
    [dispatch]
  );

  if (loading) {
    return <div className="text-center">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const gridTemplateColumns = `200px repeat(${columns.length - 1}, 1fr)`;

  return (
    <div>
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
                  onApplyFilter: handleLeagueFilter,
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

      {isCombined ? (
        <>
          <SortingHeaders
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
            gridTemplateColumns={gridTemplateColumns}
          />
          <div className="my-2" />
          {getSortedTeams(filteredTeams).map((team) => (
            <LolTeamRow
              key={team.id}
              team={team}
              columns={columns}
              gridTemplateColumns={gridTemplateColumns}
              esportName={esportName}
            />
          ))}
        </>
      ) : (
        Object.entries(teamsByLeague).map(([league, teamsInLeague]) => (
          <div key={league} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{league}</h2>
            <SortingHeaders
              columns={columns}
              sortConfig={sortConfig}
              onSort={handleSort}
              gridTemplateColumns={gridTemplateColumns}
            />
            <div className="my-2" />
            {getSortedTeams(teamsInLeague).map((team) => (
              <LolTeamRow
                key={team.id}
                team={team}
                columns={columns}
                gridTemplateColumns={gridTemplateColumns}
                esportName={esportName}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

// Extracted sorting headers component for reuse
const SortingHeaders: React.FC<{
  columns: Array<{ label: string; key: SortKey }>;
  sortConfig: { key: SortKey; direction: "asc" | "desc" };
  onSort: (key: SortKey) => void;
  gridTemplateColumns: string;
}> = React.memo(({ columns, sortConfig, onSort, gridTemplateColumns }) => (
  <div className="grid gap-0" style={{ gridTemplateColumns }}>
    {columns.map((column) => (
      <button
        key={column.key}
        onClick={() => onSort(column.key)}
        className="flex items-center justify-center w-full px-2 py-1 bg-primary-200 dark:bg-secondary-500 text-black dark:text-white font-semibold hover:bg-primary-300"
      >
        <span className="text-sm font-bold">{column.label}</span>
        <span className="ml-1 text-xs">
          {sortConfig?.key === column.key ? (
            sortConfig.direction === "asc" ? (
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
            <span className="text-xs font-thin">—</span>
          )}
        </span>
      </button>
    ))}
  </div>
));

export default TeamsTab;

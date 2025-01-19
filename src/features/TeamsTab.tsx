import React, { useMemo, useState, useCallback } from "react";
import Spinner from "src/components/Spinner";
import StatsTable from "src/components/StatsTable";
import LolTeamRow from "src/components/LolTeamRow";
import { openModal, closeModal } from "src/actions/modals";
import { groupLeaguesByTier, teamData } from "src/teams";
import { useAppSelector, useAppDispatch } from "src/hooks";
import {
  selectTeamsList,
  selectTeamsLoading,
  selectTeamsError,
} from "src/selectors";
import esportsConfig from "src/esports-config";
import { Team } from "src/schemas/team";
import { TeamAggStats } from "src/schemas/team-agg-stats";

type TeamsTabProps = {
  esportName: string;
};

interface TeamWithComputed extends Team {
  league: string;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ esportName }) => {
  const dispatch = useAppDispatch();
  const game = esportsConfig.find((g) => g.path === esportName);

  // Read store data
  const teams = useAppSelector(selectTeamsList);
  const loading = useAppSelector(selectTeamsLoading);
  const error = useAppSelector(selectTeamsError);

  // Local UI states
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "seriesRecord",
    direction: "desc",
  });
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [isCombined, setIsCombined] = useState(false);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  // Pagination config
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100; // Adjust as needed

  // Build columns
  const columns = useMemo(() => {
    if (!showAdvancedStats) {
      return [
        { label: "Team", key: "name" },
        { label: "Record", key: "seriesRecord" },
        { label: "Wins", key: "totalWins" },
        { label: "Losses", key: "totalLosses" },
        { label: "WR%", key: "winRate" },
        { label: "Streak", key: "currentWinStreak" },
      ];
    }
    return [
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
  }, [showAdvancedStats]);

  // Transform + Filter + Sort
  const sortedTeams = useMemo<TeamWithComputed[]>(() => {
    let newTeams = teams.map((team) => {
      const nameClean = team.name
        .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "")
        .trim();
      const info = teamData[nameClean];
      return {
        ...team,
        league: info?.league ?? "",
      };
    });

    if (selectedLeagues.length > 0) {
      newTeams = newTeams.filter((t) => {
        if (t.league === "Unknown") return false;
        return selectedLeagues.includes(t.league);
      });
    }

    newTeams.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.key) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "seriesRecord":
          comparison =
            (a.aggStats?.seriesWinRate ?? 0) - (b.aggStats?.seriesWinRate ?? 0);
          break;
        case "winRate":
          comparison =
            (a.aggStats?.totalWinRate ?? 0) - (b.aggStats?.totalWinRate ?? 0);
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
        default: {
          const statKey = sortConfig.key as keyof TeamAggStats;
          const aVal = a.aggStats?.[statKey] ?? 0;
          const bVal = b.aggStats?.[statKey] ?? 0;
          comparison = (aVal as number) - (bVal as number);
        }
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return newTeams;
  }, [teams, selectedLeagues, sortConfig]);

  // Pagination: if combined, we paginate the entire sortedTeams list
  // If not combined, we show separate league sections—so pagination is more complicated.
  // For demonstration, let's only paginate when `isCombined = true`.
  const paginatedTeams = useMemo(() => {
    if (!isCombined) return sortedTeams; // no pagination if separating by league
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedTeams.slice(startIndex, endIndex);
  }, [sortedTeams, isCombined, currentPage, pageSize]);

  // Group by league if not combined
  const leagueGroups = useMemo(() => {
    if (isCombined) return null;
    const grouped: Record<string, TeamWithComputed[]> = {};
    sortedTeams.forEach((t) => {
      const key = t.league || "Unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    });
    return grouped;
  }, [isCombined, sortedTeams]);

  // Tiers for ordering leagues
  const orderedLeagues = useMemo(() => {
    const tiers = groupLeaguesByTier();
    return [
      ...tiers[1],
      ...tiers[2],
      ...tiers[3],
      ...tiers[4],
      ...tiers[5],
      ...tiers[6],
    ];
  }, []);

  // Sorting
  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "desc" ? "asc" : "desc" }
        : { key, direction: "desc" }
    );
  }, []);

  // Filter apply
  const handleFilterApply = useCallback(
    (leagues: string[]) => {
      setSelectedLeagues(leagues);
      dispatch(closeModal());
    },
    [dispatch]
  );

  // Grid template for StatsTable
  const gridTemplateColumns = `225px repeat(${columns.length - 1}, 1fr)`;

  // Early returns after hooks
  if (!game) {
    return <div className="text-center text-red-500">Invalid eSport name</div>;
  }
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }
  if (loading && teams.length === 0) {
    return <Spinner />;
  }
  if (teams.length === 0) {
    return <div className="text-center">No teams found.</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-2 space-x-2">
        <button
          onClick={() =>
            dispatch(
              openModal("LOL_REGION_FILTER", {
                onApplyFilter: handleFilterApply,
              })
            )
          }
          className="px-4 py-2 bg-primary-500 text-secondary-500 rounded hover:bg-primary-600"
        >
          Filter
        </button>
        <button
          onClick={() => {
            setIsCombined((prev) => !prev);
            setCurrentPage(1); // reset pagination if toggling
          }}
          className="px-4 py-2 bg-primary-500 text-secondary-500 rounded hover:bg-primary-600"
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

      {loading && teams.length > 0 && (
        <div className="text-center mb-2">
          <Spinner />
        </div>
      )}

      {isCombined ? (
        <>
          <StatsTable<TeamWithComputed>
            columns={columns}
            data={paginatedTeams}
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

          {/* Pagination controls (only visible if combining all teams) */}
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
              disabled={paginatedTeams.length < pageSize}
              className="px-4 py-2 bg-primary-500 text-secondary-500 rounded hover:bg-primary-600"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        // League‐by‐league render
        orderedLeagues
          .filter((lg) => leagueGroups?.[lg]?.length)
          .map((lg) => (
            <div key={lg} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{lg}</h2>
              <StatsTable<TeamWithComputed>
                columns={columns}
                data={leagueGroups![lg]}
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

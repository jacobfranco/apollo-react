import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import {
  selectTeamById,
  selectTeamLoading,
  selectTeamError,
} from "src/selectors";
import { fetchTeamById } from "src/actions/teams";
import { Column } from "src/components/Column";
import TeamHeader from "src/components/TeamHeader";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { formatStreak } from "src/utils/scoreboards";
import { Series } from "src/schemas/series";

const TeamDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName, teamId } = useParams<{
    esportName: string;
    teamId: string;
  }>();
  const teamIdNumber = Number(teamId);

  // Get the team from the store
  const team = useAppSelector((state) => selectTeamById(state, teamIdNumber));
  const loading = useAppSelector((state) =>
    selectTeamLoading(state, teamIdNumber)
  );
  const error = useAppSelector((state) => selectTeamError(state, teamIdNumber));

  // Fetch the team if it's not available
  useEffect(() => {
    if (!team && !loading) {
      dispatch(fetchTeamById(esportName, teamIdNumber));
    }
  }, [dispatch, team, loading, esportName, teamIdNumber]);

  if (loading || !team) {
    return (
      <Column label="Loading..." transparent={false} withHeader={true}>
        <div className="text-center">Loading team data...</div>
      </Column>
    );
  }

  if (error) {
    return (
      <Column label="Error" transparent={false} withHeader={true}>
        <div className="text-center text-red-500">{error}</div>
      </Column>
    );
  }

  return (
    <Column label={team.name} transparent={false} withHeader={true}>
      <div className="space-y-6">
        {/* Team Header */}
        <TeamHeader team={team} />

        {/* Team Agg Stats */}
        {team.aggStats && (
          <div>
            <h2 className="text-2xl font-bold">Team Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Display stats in a grid */}
              <div className="flex justify-between">
                <span>Total Matches:</span>
                <span>{team.aggStats.totalMatches}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Wins:</span>
                <span>{team.aggStats.totalWins}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Losses:</span>
                <span>{team.aggStats.totalLosses}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span>
                  {team.aggStats.totalMatches > 0
                    ? (
                        (team.aggStats.totalWins / team.aggStats.totalMatches) *
                        100
                      ).toFixed(2)
                    : "0.00"}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Win Streak:</span>
                <span>{formatStreak(team.aggStats.currentWinStreak)}</span>
              </div>
              {/* Add more stats as needed */}
            </div>
          </div>
        )}

        {/* Series History */}
      </div>
    </Column>
  );
};

export default TeamDetail;

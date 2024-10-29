import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { selectSeriesById, selectMatchById } from "src/selectors";
import { fetchMatch } from "src/actions/matches";
import TeamsHeader from "./TeamsHeader";
import PlayerRow from "./PlayerRow";
import { Tabs } from "src/components"; // Import Tabs component

interface LolScoreboardDetailProps {
  seriesId: number;
}

const LolScoreboardDetail: React.FC<LolScoreboardDetailProps> = ({
  seriesId,
}) => {
  const dispatch = useAppDispatch();

  // Fetch series data
  const series = useAppSelector((state) => selectSeriesById(state, seriesId));

  // State to track selected tab (index of availableMatches)
  const [selectedTab, setSelectedTab] = useState<number>(0); // Initialize with first match

  // Fetch match data for all matches in the series
  const matches = useAppSelector((state) =>
    series && series.matchIds
      ? series.matchIds.map((matchId) => selectMatchById(state, matchId))
      : []
  );

  // Dispatch action to fetch match data if not available
  useEffect(() => {
    if (series && series.matchIds && series.matchIds.length > 0) {
      series.matchIds.forEach((matchId, index) => {
        const match = matches[index];
        if (!match) {
          dispatch(fetchMatch(matchId));
        }
      });
    }
  }, [dispatch, series]);

  // Filter out matches where match.lifecycle === "deleted"
  const availableMatches = matches.filter(
    (match) => match && match.lifecycle !== "deleted"
  );

  // Ensure selectedTab is within the bounds of availableMatches
  useEffect(() => {
    if (selectedTab >= availableMatches.length) {
      setSelectedTab(0);
    }
  }, [selectedTab, availableMatches.length]);

  // Selected match based on selectedTab
  const selectedMatch = availableMatches[selectedTab];

  // Participants from match data
  let team1, team2, team1Players, team2Players;

  if (selectedMatch) {
    team1 = selectedMatch.participants[0];
    team2 = selectedMatch.participants[1];

    if (team1.roster.team && team2.roster.team) {
      team1Players = team1.roster.players;
      team2Players = team2.roster.players;
    }
  }

  // **Retrieve Series Scores**
  const team1SeriesScore = series?.participants?.[0]?.score || 0;
  const team2SeriesScore = series?.participants?.[1]?.score || 0;

  // Render component
  return (
    <div className="relative text-white">
      {/* Loading states */}
      {!series && <div>Loading series data...</div>}
      {series && matches.length === 0 && <div>Loading match data...</div>}
      {series && matches.length > 0 && availableMatches.length === 0 && (
        <div>No available matches in this series.</div>
      )}
      {series &&
        matches.length > 0 &&
        availableMatches.length > 0 &&
        !selectedMatch && <div>Loading selected match data...</div>}

      {/* When data is available */}
      {series &&
        matches.length > 0 &&
        availableMatches.length > 0 &&
        selectedMatch && (
          <>
            {/* Match Tabs */}
            <div className="flex justify-center items-center px-4">
              <div className="w-full max-w-md">
                <Tabs
                  items={availableMatches.map((match, index) => ({
                    text: (index + 1).toString(),
                    action: () => setSelectedTab(index),
                    name: index.toString(),
                  }))}
                  activeItem={selectedTab.toString()}
                />
              </div>
            </div>

            {/* Teams Header with Series Scores */}
            <TeamsHeader
              match={selectedMatch}
              bestOf={series?.format?.bestOf || 1}
              team1SeriesScore={team1SeriesScore}
              team2SeriesScore={team2SeriesScore}
            />

            {/* Players */}
            {team1Players && team2Players && (
              <div className="flex">
                {/* Team 1 Players */}
                <div className="w-1/2">
                  {team1Players.map((player) => (
                    <PlayerRow key={player.id} player={player} />
                  ))}
                </div>

                {/* Team 2 Players */}
                <div className="w-1/2">
                  {team2Players.map((player) => (
                    <PlayerRow key={player.id} player={player} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
    </div>
  );
};

export default LolScoreboardDetail;

// Utility function to format duration
function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

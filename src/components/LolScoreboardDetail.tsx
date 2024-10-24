// components/LolScoreboardDetail.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'src/hooks';
import { selectSeriesById } from 'src/selectors';
import { selectMatchById } from 'src/selectors';
import { fetchMatch } from 'src/actions/matches';
import TeamHeader from './TeamHeader';
import PlayerRow from './PlayerRow';
import MatchDetails from './MatchDetails';

interface LolScoreboardDetailProps {
  seriesId: number;
}

const LolScoreboardDetail: React.FC<LolScoreboardDetailProps> = ({ seriesId }) => {
  const dispatch = useAppDispatch();

  // Fetch series data
  const series = useAppSelector((state) => selectSeriesById(state, seriesId));

  if (!series) {
    return <div>Loading series data...</div>;
  }

  // State to track selected match ID
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  // Default to the first match in the series
  useEffect(() => {
    if (series.matchIds && series.matchIds.length > 0) {
      setSelectedMatchId(series.matchIds[0]);
    }
  }, [series.matchIds]);

  // Fetch match data
  const match = useAppSelector((state) =>
    selectedMatchId ? selectMatchById(state, selectedMatchId) : null
  );

  // Dispatch action to fetch match data if not available
  useEffect(() => {
    if (selectedMatchId && !match) {
      dispatch(fetchMatch(selectedMatchId));
    }
  }, [dispatch, selectedMatchId, match]);

  if (!match) {
    return <div>Loading match data...</div>;
  }

  // Participants from match data
  const team1 = match.participants[0];
  const team2 = match.participants[1];

  if (!team1.roster.team || !team2.roster.team) {
    return <div>Team information is not available.</div>;
  }

  const team1Players = team1.roster.players;
  const team2Players = team2.roster.players;

  // Calculate match duration
  // Calculate match duration
let matchDuration = '';
if (typeof match.start === 'number' && typeof match.end === 'number') {
  matchDuration = formatDuration(match.end - match.start);
}


  // Render match selection menu
const renderMatchMenu = () => {
  if (series.matchIds && series.matchIds.length > 0) {
    return (
      <div>
        <label htmlFor="match-select">Select Match: </label>
        <select
          id="match-select"
          value={selectedMatchId || undefined}
          onChange={(e) => setSelectedMatchId(Number(e.target.value))}
        >
          {series.matchIds.map((matchId, index) => (
            <option key={matchId} value={matchId}>
              Match {index + 1}
            </option>
          ))}
        </select>
      </div>
    );
  } else {
    return <div>No matches available in this series.</div>;
  }
};


  return (
    <div className="text-white">
      {/* Match Menu */}
      {renderMatchMenu()}

      {/* Match Details */}
      <MatchDetails duration={matchDuration} status={match.lifecycle.toUpperCase()} />

      {/* Teams Header */}
      <div className="flex justify-between">
        <TeamHeader team={team1.roster.team} score={team1.score} />
        <TeamHeader team={team2.roster.team} score={team2.score} />
      </div>

      {/* Players */}
      <div className="flex">
        {/* Team 1 Players */}
        <div className="w-1/2">
          {team1Players?.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </div>

        {/* Team 2 Players */}
        <div className="w-1/2">
          {team2Players?.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LolScoreboardDetail;

// Utility function to format duration
function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

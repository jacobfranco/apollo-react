import React from 'react';
import { Link } from 'react-router-dom';
import ScoreboardOverlay from './ScoreboardOverlay';
import { ScoreboardProps } from './Scoreboard';

interface Team {
  name: string;
  kills: number;
  gold: number;
  towers: number;
  logo: string;
  record: string;
  seed: number;
}

interface LoLScoreboardProps extends ScoreboardProps {
  team1: Team;
  team2: Team;
  seriesInfo: string;
  gameNumber: string;
  leadingTeam: string;
  leadingScore: string;
}

const LoLScoreboard: React.FC<LoLScoreboardProps> = ({
  gameId,
  team1,
  team2,
  seriesInfo,
  gameNumber,
  leadingTeam,
  leadingScore,
}) => {
  // Hardcode the values for now
  const winningSide = 'right'; // Change to 'left' or 'right' to test
  const winningColor = '#A981FC'; // Change this color to test

  return (
    <Link
      to={`/games/lol/scores/${gameId}`}
      className="block p-0 m-0"
      style={{
        position: 'relative',
        paddingTop: '40.8%',
        width: '100%',
        borderRadius: '5px',
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(128, 128, 128, 0.1))',
        // TODO: Need to add border or shadow of some kind 
        textDecoration: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Content goes here */}
      <ScoreboardOverlay winningSide={winningSide} winningColor={winningColor} />
   
    </Link>
  );
};

export default LoLScoreboard;

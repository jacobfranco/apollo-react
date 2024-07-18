import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
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

  return (
    <Link
      to={`/games/lol/scores/${gameId}`}
      className="block p-0 m-0"
      style={{
        paddingTop: '40.8%',  // Keep this for aspect ratio if necessary
        width: '100%',
        borderRadius: '5px',
        background: 'linear-gradient(to bottom, #FFFFFF, #808080)',
        opacity: 0.1,
        border: '1px solid #F1F1F1',
        textDecoration: 'none'
      }}
    >
      {/* Content goes here */}
    </Link>
  );
};

export default LoLScoreboard;

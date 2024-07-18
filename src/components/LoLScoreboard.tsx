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
    <div style={{ width: '100%', paddingTop: '40.79%', borderRadius: '15px', backgroundColor: '#ccc', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '15px', backgroundColor: '#fff' }}>
        {/* Content goes here */}
      </div>
    </div>
  );
  
  return (
    <Link to={`/games/lol/scores/${gameId}`} style={{ display: 'inline-block', paddingTop: '40.8%', width: '100%', borderRadius: '20px', background: '#f0f0f0', textDecoration: 'none' }}>
      {/* Content goes here */}
    </Link>
  );
  
};

export default LoLScoreboard;

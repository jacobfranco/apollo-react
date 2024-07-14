import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ScoreboardProps } from './Scoreboards';

interface ValorantTeam {
  name: string;
  score: number;
  logo: string;
}

interface ValorantScoreboardProps extends ScoreboardProps {
  team1: ValorantTeam;
  team2: ValorantTeam;
  matchInfo: string;
}

const ValorantScoreboard: React.FC<ValorantScoreboardProps> = ({
  gameId,
  team1,
  team2,
  matchInfo,
}) => {
  return (
    <Link to={`/games/valorant/${gameId}/details`} className={clsx("cursor-pointer p-4 rounded-xl shadow-lg bg-white dark:bg-accent-700 text-gray-900 dark:text-gray-100 grid grid-rows-[auto_1fr_auto] gap-4 max-w-lg mx-auto")}>
      <div className="text-lg font-bold text-red-500">{matchInfo}</div>
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="flex flex-col items-center">
          <img src={team1.logo} alt={`${team1.name} logo`} className="w-12 h-12 mb-2" />
          <span className="text-base font-bold">{team1.name}</span>
          <span className="text-2xl font-bold">{team1.score}</span>
        </div>
        <div className="flex flex-col items-center">
          <img src={team2.logo} alt={`${team2.name} logo`} className="w-12 h-12 mb-2" />
          <span className="text-base font-bold">{team2.name}</span>
          <span className="text-2xl font-bold">{team2.score}</span>
        </div>
      </div>
    </Link>
  );
};

export default ValorantScoreboard;

// src/components/LoLScoreboard.tsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';

interface Team {
  name: string;
  kills: number;
  gold: number;
  towers: number;
  logo: string;
  record: string;
  seed: number;
}

interface LoLScoreboardProps {
  gameId: number;
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
  const history = useHistory();

  const handleClick = () => {
    history.push(`/game/lol/${gameId}`);
  };

  return (
    <div onClick={handleClick} className={clsx("cursor-pointer p-4 rounded-xl shadow-lg bg-white dark:bg-accent-700 text-gray-900 dark:text-gray-100 grid grid-rows-[auto_1fr_auto] gap-4 max-w-lg mx-auto")}>
      <div className="text-lg font-bold text-purple-500">{seriesInfo}</div>
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="flex flex-col items-center">
          <img src={team1.logo} alt={`${team1.name} logo`} className="w-12 h-12 mb-2" />
          <span className="text-base font-bold">
            <span className="text-xs text-gray-500">{team1.seed}</span> {team1.name}
          </span>
          <span className="text-sm text-gray-500">{team1.record}</span>
          <div className="flex items-center mt-2">
            <img src="/src/assets/tower.png" alt="Towers" className="w-5 h-5 mx-1" />
            <span>{team1.towers}</span>
          </div>
          <div className="flex items-center mt-1">
            <img src="/src/assets/gold.png" alt="Gold" className="w-5 h-5 mx-1" />
            <span>{team1.gold}</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{team1.kills}</span>
          <img src="/src/assets/sword.png" alt="VS" className="w-8 h-8 mx-4" />
          <span className="text-2xl font-bold">{team2.kills}</span>
        </div>
        <div className="flex flex-col items-center">
          <img src={team2.logo} alt={`${team2.name} logo`} className="w-12 h-12 mb-2" />
          <span className="text-base font-bold">
            <span className="text-xs text-gray-500">{team2.seed}</span> {team2.name}
          </span>
          <span className="text-sm text-gray-500">{team2.record}</span>
          <div className="flex items-center mt-2">
            <img src="/src/assets/tower.png" alt="Towers" className="w-5 h-5 mx-1" />
            <span>{team2.towers}</span>
          </div>
          <div className="flex items-center mt-1">
            <img src="/src/assets/gold.png" alt="Gold" className="w-5 h-5 mx-1" />
            <span>{team2.gold}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <div>{gameNumber}</div>
        <div>{leadingTeam} leads {leadingScore}</div>
      </div>
    </div>
  );
};

export default LoLScoreboard;

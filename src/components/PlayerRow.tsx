// components/PlayerRow.tsx
import React from 'react';
import { Player } from 'src/schemas/player';
import StatIcon from './StatIcon';

interface PlayerRowProps {
  player: Player;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player }) => {
  // Extract stats from player.matchStats
  const { kills, deaths, assists, totalCreepScore, champion, items } = player.matchStats || {};

  return (
    <div className="flex items-center p-2">
      <img src={player.images?.[0]?.url || '/placeholder.png'} alt="" className="w-8 h-8" />
      <div className="ml-2 flex-1">
        <div className="text-sm font-bold">{player.nickName}</div>
        <div className="text-xs text-gray-500">{player.role}</div>
      </div>
      <div className="flex space-x-2">
        <StatIcon iconSrc="/icons8sword50.png" value={`${kills}/${deaths}/${assists}`} />
        <StatIcon iconSrc="/icons8minion48.png" value={totalCreepScore ?? 0} />
        {/* Map over items to display item icons */}
        <div className="flex space-x-1">
          {items?.map((item, index) => (
            <img key={index} src={item.item.images[0].url} alt="" className="w-4 h-4" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerRow;

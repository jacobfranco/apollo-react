import React from 'react';
import { Link, useParams } from 'react-router-dom';
import gameConfig from 'src/game-config';

const GamePageMenu: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const game = gameConfig.find(g => g.path === gameName);

  if (!game) {
    return null;
  }

  const tabs = game.isEsport
    ? ['Community', 'Scores', 'Standings', 'Stats', 'Fantasy', 'Media']
    : ['Community', 'Media'];

  return (
    <div className="flex justify-center mb-4 space-x-4 border-b">
      {tabs.map((tab) => (
        <Link
          key={tab}
          to={`/games/${gameName}/${tab.toLowerCase()}`}
          className="px-4 py-2 text-gray-700 hover:text-blue-500 relative"
        >
          {tab}
        </Link>
      ))}
    </div>
  );
};

export default GamePageMenu;

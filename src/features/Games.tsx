// src/features/Games.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import gameConfig from 'src/game-config';

const Games: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {gameConfig.map((game) => (
        <Link key={game.path} to={`/games/${game.path}`} className="block p-4 bg-blue-500 text-white rounded-lg">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">{game.name}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Games;

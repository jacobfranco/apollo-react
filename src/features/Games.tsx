// src/features/Games.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { initialLoLScoreboardState } from 'src/slices/LoLScoreboardSlice';

const Games: React.FC = () => {
  const { games } = initialLoLScoreboardState;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {games.map((game) => (
        <Link key={game.id} to={`/game/${game.id}`} className="block p-4 bg-blue-500 text-white rounded-lg">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">{game.team1.name} vs {game.team2.name}</h2>
            <p>{game.seriesInfo}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Games;

// src/pages/GamePage.tsx
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { initialLoLScoreboardState } from 'src/slices/LoLScoreboardSlice';
import LoLScoreboard from '../components/LoLScoreboard';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();

  if (!gameId) {
    return <div className="text-center text-red-500">Invalid game ID</div>;
  }

  const game = initialLoLScoreboardState.games.find(game => game.id === parseInt(gameId));

  if (!game) {
    return <div className="text-center text-red-500">Game not found</div>;
  }

  const handleBackClick = () => {
    history.push('/games');
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={handleBackClick} className="mb-6 p-2 bg-blue-500 text-white rounded-lg">Back to Games</button>
      <h1 className="text-3xl font-bold mb-6">{game.team1.name} vs {game.team2.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoLScoreboard 
          gameId={game.id}
          team1={game.team1}
          team2={game.team2}
          seriesInfo={game.seriesInfo}
          gameNumber={game.gameNumber}
          leadingTeam={game.leadingTeam}
          leadingScore={game.leadingScore}
        />
      </div>
    </div>
  );
};

export default GamePage;

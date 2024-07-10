import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LoLScoreboard from '../components/LoLScoreboard';
import { initialLoLScoreboardState } from 'src/slices/LoLScoreboardSlice';
import gameConfig from 'src/game-config';

const GamePage: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const game = gameConfig.find(g => g.path === gameName);

  if (!game) {
    return <div className="text-center text-red-500">Invalid game name</div>;
  }

  const renderContent = () => {
    if (game.isEsport) {
      const { games } = initialLoLScoreboardState;
      return (
        <div>
          <div className="flex justify-center mb-4">
            <Link to={`/games/${game.path}/scores`} className="mr-4">Scores</Link>
            <Link to={`/games/${game.path}/standings`} className="mr-4">Standings</Link>
            <Link to={`/games/${game.path}/stats`} className="mr-4">Stats</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <LoLScoreboard 
                key={game.id} 
                gameId={game.id} 
                team1={game.team1} 
                team2={game.team2} 
                seriesInfo={game.seriesInfo} 
                gameNumber={game.gameNumber} 
                leadingTeam={game.leadingTeam} 
                leadingScore={game.leadingScore} 
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">{game.name}</h2>
          <p>Timeline of posts tagged to {game.name}</p>
          {/* Display timeline posts */}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      {renderContent()}
    </div>
  );
};

export default GamePage;

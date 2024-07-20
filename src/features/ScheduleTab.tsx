import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LolScoreboard from 'src/components/LolScoreboard';
import ValorantScoreboard from 'src/components/ValorantScoreboard';
import { initialLoLScoreboardState } from 'src/slices/lol-scoreboard';
import { initialValorantScoreboardState } from 'src/slices/valorant-scoreboard';
import gameConfig from 'src/game-config';

const ScheduleTab: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const game = gameConfig.find(g => g.path === gameName);

  if (!game) {
    return <div className="text-center text-red-500">Invalid game name</div>;
  }

  const renderScoresContent = () => {
    switch (game.path) {
      case 'lol': {
        const { matches } = initialLoLScoreboardState;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
            {matches.map((match) => (
              <Link 
                key={match.id} 
                to={`/games/${gameName}/scores/${match.id}`} 
                className="block p-0 m-0"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <LolScoreboard
                  match={match}
                />
              </Link>
            ))}
          </div>
        );
      }
      case 'valorant': {
        const { games } = initialValorantScoreboardState;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {games.map((game) => (
              <Link 
                key={game.id} 
                to={`/games/${gameName}/scores/${game.id}`} 
                className="block p-0 m-0"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <ValorantScoreboard
                  id={game.id}
                  team1={game.team1}
                  team2={game.team2}
                  matchInfo={game.matchInfo}
                />
              </Link>
            ))}
          </div>
        );
      }
      default:
        return <div>Unsupported game type for scores content</div>;
    }
  };

  return (
    <div className="space-y-8 mt-4">
      {renderScoresContent()}
    </div>
  );
};

export default ScheduleTab;

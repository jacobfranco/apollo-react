import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { initialLoLScoreboardState } from 'src/slices/lol-scoreboard';
import { initialValorantScoreboardState } from 'src/slices/valorant-scoreboard';
import { getScoreboardComponent } from 'src/components/Scoreboard';
import gameConfig from 'src/game-config';

const ScoresTab: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const game = gameConfig.find(g => g.path === gameName);

  if (!game) {
    return <div className="text-center text-red-500">Invalid game name</div>;
  }

  const ScoreboardComponent = getScoreboardComponent(game.path);

  const renderScoresContent = () => {
    if (!ScoreboardComponent) {
      return <div>Scoreboard component not found for {game.name}</div>;
    }

    switch (game.path) {
      case 'lol': {
        const { games } = initialLoLScoreboardState;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <Link key={game.id} to={`/games/${gameName}/scores/${game.id}`}>
                <ScoreboardComponent
                  gameId={game.id}
                  team1={game.team1}
                  team2={game.team2}
                  seriesInfo={game.seriesInfo}
                  gameNumber={game.gameNumber}
                  leadingTeam={game.leadingTeam}
                  leadingScore={game.leadingScore}
                />
              </Link>
            ))}
          </div>
        );
      }
      case 'valorant': {
        const { games } = initialValorantScoreboardState;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <Link key={game.id} to={`/games/${gameName}/scores/${game.id}`}>
                <ScoreboardComponent
                  gameId={game.id}
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
    <div>
      {renderScoresContent()}
    </div>
  );
};

export default ScoresTab;

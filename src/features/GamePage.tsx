import React from 'react';
import { useParams, Route, Switch } from 'react-router-dom';
import { initialLoLScoreboardState } from 'src/slices/lol-scoreboard';
import { initialValorantScoreboardState } from 'src/slices/valorant-scoreboard';
import gameConfig from 'src/game-config';
import GamePageMenu from 'src/components/GamePageMenu';
import { getScoreboardComponent, ScoreboardProps } from 'src/components/Scoreboards';

const GamePage: React.FC = () => {
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
              <ScoreboardComponent
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
        );
      }
      case 'valorant': {
        const { games } = initialValorantScoreboardState;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <ScoreboardComponent
                key={game.id}
                gameId={game.id}
                team1={game.team1}
                team2={game.team2}
                matchInfo={game.matchInfo}
              />
            ))}
          </div>
        );
      }
      default:
        return <div>Unsupported game type for scores content</div>;
    }
  };

  const renderEsportContent = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{game.name} Esports</h2>
        {/* Additional esports content can go here */}
      </div>
    );
  };

  const renderNonEsportContent = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{game.name}</h2>
        <p>Timeline of posts tagged to {game.name}</p>
        {/* Display timeline posts */}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <GamePageMenu />
      <Switch>
        <Route path={`/games/${gameName}/community`}>
          <div>Community Content</div>
        </Route>
        {game.isEsport && (
          <>
            <Route path={`/games/${gameName}/scores`}>
              {renderScoresContent()}
            </Route>
            <Route path={`/games/${gameName}/standings`}>
              <div>Standings Content</div>
            </Route>
            <Route path={`/games/${gameName}/stats`}>
              <div>Stats Content</div>
            </Route>
            <Route path={`/games/${gameName}/fantasy`}>
              <div>Fantasy Content</div>
            </Route>
          </>
        )}
        <Route path={`/games/${gameName}/media`}>
          <div>Media Content</div>
        </Route>
        <Route path={`/games/${gameName}`}>
          {game.isEsport ? renderEsportContent() : renderNonEsportContent()}
        </Route>
      </Switch>
    </div>
  );
};

export default GamePage;

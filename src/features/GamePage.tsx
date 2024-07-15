import React from 'react';
import { Route, Switch, Redirect, useParams } from 'react-router-dom';
import gameConfig from 'src/game-config';
import GamePageMenu from 'src/components/GamePageMenu';
import {
  CommunityTab,
  ScoreDetailsTab,
  ScoresTab,
  StandingsTab,
  StatsTab,
  FantasyTab,
  MediaTab
} from 'src/features/AsyncComponents'

const GamePage: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const game = gameConfig.find(g => g.path === gameName);

  if (!game) {
    return <div className="text-center text-red-500">Invalid game name</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <GamePageMenu />
      <Switch>
        <Route path={`/games/:gameName/community`} component={CommunityTab} />
        <Route path={`/games/:gameName/scores/:gameId`} component={ScoreDetailsTab} />
        <Route path={`/games/:gameName/scores`} component={ScoresTab} />
        <Route path={`/games/:gameName/standings`} component={StandingsTab} />
        <Route path={`/games/:gameName/stats`} component={StatsTab} />
        <Route path={`/games/:gameName/fantasy`} component={FantasyTab} />
        <Route path={`/games/:gameName/media`} component={MediaTab} />
        <Redirect exact from="/games/:gameName" to="/games/:gameName/community" />
      </Switch>
    </div>
  );
};

export default GamePage;

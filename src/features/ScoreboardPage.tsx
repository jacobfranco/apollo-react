import React from 'react';
import { useParams } from 'react-router-dom';
import { getScoreboardComponent } from 'src/components/Scoreboard';

const ScoreboardPage: React.FC = () => {
  const { gameName, gameId } = useParams<{ gameName: string; gameId: string }>();
  const ScoreboardComponent = getScoreboardComponent(gameName);

  if (!ScoreboardComponent) {
    return <div className="text-center text-red-500">Invalid game name</div>;
  }

  return <ScoreboardComponent gameId={Number(gameId)} />;
};

export default ScoreboardPage;
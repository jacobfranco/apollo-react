import React from 'react';
import { useParams } from 'react-router-dom';
import { getScoreboardDetailComponent } from 'src/components/ScoreboardDetail';

const ScoreboardDetailPage: React.FC = () => {
  const { gameName, gameId } = useParams<{ gameName: string; gameId: string }>();
  const ScoreboardDetailComponent = getScoreboardDetailComponent(gameName);

  if (!ScoreboardDetailComponent) {
    return <div className="text-center text-red-500">Invalid game name</div>;
  }

  return <ScoreboardDetailComponent gameId={Number(gameId)} />;
};

export default ScoreboardDetailPage;
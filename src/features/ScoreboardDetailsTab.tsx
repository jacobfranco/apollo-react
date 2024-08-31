import React from 'react';
import { useParams } from 'react-router-dom';

const ScoreboardDetailsTab: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  return <div>Score Details for gameId {gameId}</div>;
};

export default ScoreboardDetailsTab;

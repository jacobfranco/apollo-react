import React from 'react';
import { useParams } from 'react-router-dom';

const ScoreDetailsTab: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  console.log("rendering score details for gameId:", gameId);
  return <div>Score Details for gameId {gameId}</div>;
};

export default ScoreDetailsTab;

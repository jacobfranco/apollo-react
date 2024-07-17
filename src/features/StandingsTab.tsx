import React from 'react';
import { useParams } from 'react-router-dom';

const StandingsTab: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();

  return <div>Standings for: {gameName}</div>;
};

export default StandingsTab;

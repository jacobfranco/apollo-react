import React from 'react';
import { useParams } from 'react-router-dom';

const StatsTab: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();

  return <div>Stats for: {gameName}</div>;
};

export default StatsTab;

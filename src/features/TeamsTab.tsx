import React from 'react';
import { useParams } from 'react-router-dom';

const TeamsTab: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();

  return <div>Teams for: {gameName}</div>;
};

export default TeamsTab;

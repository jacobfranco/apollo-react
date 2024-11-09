import React from "react";
import { useParams } from "react-router-dom";

const PlayersTab: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();

  return <div>Players for: {gameName}</div>;
};

export default PlayersTab;

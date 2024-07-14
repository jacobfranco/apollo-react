import React from 'react';
import { useParams } from 'react-router-dom';

const LolScoreboardDetail: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div>
      <h2>LoL Scoreboard Detail for Game {gameId}</h2>
      {/* Render detailed information for the LoL game */}
      <p> Test </p>
    </div>
  );
};

export default LolScoreboardDetail;

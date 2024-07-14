import React from 'react';
import { useParams } from 'react-router-dom';

const ValorantScoreboardDetail: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div>
      <h2>Valorant Scoreboard Detail for Game {gameId}</h2>
      {/* Render detailed information for the Valorant game */}
    </div>
  );
};

export default ValorantScoreboardDetail;

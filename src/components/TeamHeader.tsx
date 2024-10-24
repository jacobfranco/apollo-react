// components/TeamHeader.tsx
import React from 'react';
import { Team } from 'src/schemas/team';

interface TeamHeaderProps {
  team: Team | null;
  score: number;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ team, score }) => (
  <div className="flex items-center justify-between p-4">
    <div className="flex items-center">
      <img src={team?.images?.[0]?.url || '/placeholder.png'} alt="" className="w-10 h-10" />
      <div className="ml-2">
        <div className="text-lg font-bold">{team?.name}</div>
        {/* Additional team info */}
      </div>
    </div>
    <div className="text-2xl font-bold">{score}</div>
  </div>
);

export default TeamHeader;

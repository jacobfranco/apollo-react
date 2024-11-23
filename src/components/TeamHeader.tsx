import React from "react";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { Team } from "src/schemas/team";

interface TeamHeaderProps {
  team: Team;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ team }) => {
  const logoUrl =
    team.images && team.images.length > 0
      ? team.images[0].url
      : placeholderTeam;

  return (
    <div className="flex items-center space-x-4 p-4 bg-primary-200 dark:bg-secondary-500 rounded-md shadow">
      <img
        src={logoUrl}
        alt={`${team.name} logo`}
        className="w-24 h-24 rounded-full"
      />
      <div>
        <h1 className="text-3xl font-bold">{team.name}</h1>
        <p className="text-lg">{team.region?.name || "Unknown Region"}</p>
        {team.abbreviation && (
          <p className="text-lg">Abbreviation: {team.abbreviation}</p>
        )}
      </div>
    </div>
  );
};

export default TeamHeader;

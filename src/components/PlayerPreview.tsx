import React from "react";
import { Player } from "src/schemas/player";
import { Link } from "react-router-dom";

type PlayerPreviewProps = {
  player: Player;
  esportName: string;
};

const PlayerPreview: React.FC<PlayerPreviewProps> = ({
  player,
  esportName,
}) => {
  return (
    <Link
      to={`/esports/${esportName}/player/${player.id}`}
      className="block pt-4 hover:brightness-110 dark:hover:brightness-150 transition-all duration-200"
    >
      <div className="bg-primary-300 dark:bg-secondary-800 rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center space-y-2">
        <div className="text-md text-gray-800 dark:text-gray-300 font-bold text-center uppercase">
          {player.role}
        </div>
        <div>
          <div className="text-md font-medium">{player.nickName}</div>
        </div>
      </div>
    </Link>
  );
};

export default PlayerPreview;

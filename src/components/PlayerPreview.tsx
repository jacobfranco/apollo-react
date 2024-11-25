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
      className="block p-2"
    >
      <div className="flex items-center space-x-2">
        <div>
          <div className="text-sm font-medium">{player.nickName}</div>
          <div className="text-xs text-gray-500">{player.role}</div>
        </div>
      </div>
    </Link>
  );
};

export default PlayerPreview;

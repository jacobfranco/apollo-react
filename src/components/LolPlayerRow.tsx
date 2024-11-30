import React from "react";
import { Player } from "src/schemas/player";
import { formatStat } from "src/utils/esports";
import placeholderTeam from "src/assets/images/placeholder-team.png";

interface LolPlayerRowProps {
  player: Player;
  columns: Array<{ label: string; key: string }>;
}

const LolPlayerRow: React.FC<LolPlayerRowProps> = ({ player, columns }) => {
  const { nickName, images, role, aggStats } = player;

  const avatarUrl =
    images && images.length > 0 ? images[0].url : placeholderTeam;

  return (
    <div className="grid grid-cols-[1fr_2fr_repeat(9,1fr)] gap-2 p-4 bg-primary-200 dark:bg-secondary-500 rounded-md mb-2 shadow">
      {columns.map((column) => {
        let value;

        switch (column.key) {
          case "role":
            value = (
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">
                {role}
              </span>
            );
            break;
          case "name":
            value = (
              <div className="flex items-center">
                <img
                  src={avatarUrl}
                  alt={`${nickName} avatar`}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {nickName}
                </span>
              </div>
            );
            break;
          case "winRate":
            const winRate = aggStats?.matches
              ? (aggStats.wins / aggStats.matches) * 100
              : 0;
            value = `${winRate.toFixed(2)}%`;
            break;
          case "kda":
            value = aggStats
              ? formatStat(
                  (aggStats.kills + aggStats.assists) / aggStats.deaths
                )
              : "-";
            break;
          default:
            const statKey = column.key as keyof typeof aggStats;
            if (aggStats && aggStats[statKey] !== undefined) {
              if (statKey === "cs") {
                value = formatStat(aggStats[statKey]);
              } else {
                value = aggStats[statKey];
              }
            } else {
              value = "-";
            }
        }

        return (
          <div
            key={column.key}
            className={`flex items-center justify-center ${
              column.key === "name" || column.key === "role"
                ? "justify-start"
                : "justify-center"
            }`}
          >
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LolPlayerRow;

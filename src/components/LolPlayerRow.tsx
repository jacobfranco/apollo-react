// src/components/LolPlayerRow.tsx

import React from "react";
import { Player } from "src/schemas/player";
import { formatStat } from "src/utils/esports";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { isPlayerAggStatsKey } from "src/utils/typeguards";

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
          case "kda":
            value = aggStats
              ? formatStat(
                  (aggStats.totalKills + aggStats.totalAssists) /
                    (aggStats.totalDeaths > 0 ? aggStats.totalDeaths : 1)
                )
              : "-";
            break;
          default:
            // Use the type guard to check if column.key is a valid PlayerAggStats key
            if (
              aggStats &&
              isPlayerAggStatsKey(column.key) &&
              typeof column.key === "string"
            ) {
              const statKey = column.key;
              if (statKey.startsWith("average")) {
                const displayValue = (aggStats[statKey] as number).toFixed(2);
                value = displayValue;
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
            className={`flex items-center ${
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

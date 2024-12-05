// LolPlayerRow.tsx

import React from "react";
import { Player } from "src/schemas/player";
import { formatStat } from "src/utils/esports";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import AutoFitText from "src/components/AutoFitText";
import { Link } from "react-router-dom";
import { PlayerAggStats } from "src/schemas/player-agg-stats";

interface LolPlayerRowProps {
  player: Player & {
    computedValues: {
      kda: number;
    };
  };
  columns: Array<{ label: string; key: string }>;
  gridTemplateColumns: string;
  esportName: string;
}

const LolPlayerRow: React.FC<LolPlayerRowProps> = ({
  player,
  columns,
  gridTemplateColumns,
  esportName,
}) => {
  const { nickName, images, aggStats, computedValues } = player;

  const avatarUrl =
    images && images.length > 0 ? images[0].url : placeholderTeam;

  return (
    <Link to={`/esports/${esportName}/player/${player.id}`} className="block">
      <div
        className={`grid gap-0 p-2 bg-primary-200 dark:bg-secondary-500 rounded-md mb-1 shadow`}
        style={{ gridTemplateColumns }}
      >
        {columns.map((column) => {
          let value;
          const isNameColumn = column.key === "name";

          if (isNameColumn) {
            return (
              <div
                key={column.key}
                className="flex items-center justify-start pr-2"
              >
                <img
                  src={avatarUrl}
                  alt={`${nickName} avatar`}
                  className={`w-10 h-10 rounded-full mr-4`}
                />
                <AutoFitText
                  text={nickName}
                  maxFontSize={16}
                  minFontSize={10}
                  maxLines={1}
                  className="text-gray-800 dark:text-gray-200 font-bold"
                  style={{ flex: 1 }}
                  textAlign="left"
                />
              </div>
            );
          } else if (column.key === "kda") {
            const kda = computedValues.kda;
            value = isFinite(kda) ? kda.toFixed(2) : "Perfect";
          } else if (column.key === "totalMatches") {
            value = aggStats?.totalMatches
              ? Math.round(aggStats.totalMatches).toString()
              : "0";
          } else {
            const statKey = column.key as keyof PlayerAggStats;

            if (aggStats && aggStats[statKey] !== undefined) {
              value = formatStat(aggStats[statKey]);
            } else {
              value = "-";
            }
          }

          return (
            <div
              key={column.key}
              className={`flex items-center ${
                isNameColumn ? "justify-start pl-4" : "justify-center"
              }`}
            >
              <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </Link>
  );
};

export default LolPlayerRow;

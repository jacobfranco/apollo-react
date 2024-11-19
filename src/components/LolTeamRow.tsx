// src/components/LolTeamRow.tsx

import React from "react";
import { Team } from "src/schemas/team";
import { formatGold, formatStat, formatStreak } from "src/utils/scoreboards";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import AutoFitText from "src/components/AutoFitText"; // Ensure the path is correct

interface LolTeamRowProps {
  team: Team;
  columns: Array<{ label: string; key: string }>;
  gridTemplateColumns: string;
}

const LolTeamRow: React.FC<LolTeamRowProps> = ({
  team,
  columns,
  gridTemplateColumns,
}) => {
  const { name, images, aggStats } = team;

  const logoUrl = images && images.length > 0 ? images[0].url : placeholderTeam;

  return (
    <div
      className={`grid ${gridTemplateColumns} gap-0 p-2 bg-primary-200 dark:bg-secondary-500 rounded-md mb-1 shadow`}
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
                src={logoUrl}
                alt={`${name} logo`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <AutoFitText
                text={name}
                maxFontSize={16}
                minFontSize={10}
                maxLines={1}
                className="text-gray-800 dark:text-gray-200 font-bold"
                style={{ flex: 1 }}
                textAlign="left" // Align text to the left
              />
            </div>
          );
        } else if (column.key === "winRate") {
          const winRate = aggStats?.totalMatches
            ? (aggStats.totalWins / aggStats.totalMatches) * 100
            : 0;
          value = `${winRate.toFixed(2)}%`;
        } else if (column.key === "currentWinStreak") {
          // Handle currentWinStreak
          const streak = aggStats?.currentWinStreak ?? 0;
          value = formatStreak(streak);
        } else {
          const statKey = column.key as keyof typeof aggStats;
          if (aggStats && aggStats[statKey] !== undefined) {
            if (statKey === "averageGoldEarned") {
              value = formatGold(aggStats[statKey]);
            } else if (
              statKey === "averageScore" ||
              statKey === "averageTurretsDestroyed" ||
              statKey === "averageInhibitorsDestroyed"
            ) {
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
  );
};

export default LolTeamRow;

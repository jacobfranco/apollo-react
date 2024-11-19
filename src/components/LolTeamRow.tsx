import React from "react";
import { Team } from "src/schemas/team";
import { formatGold, formatStat, formatStreak } from "src/utils/scoreboards";
import placeholderTeam from "src/assets/images/placeholder-team.png";

interface LolTeamRowProps {
  team: Team;
  columns: Array<{ label: string; key: string }>;
}

const LolTeamRow: React.FC<LolTeamRowProps> = ({ team, columns }) => {
  const { name, images, aggStats } = team;

  const logoUrl = images && images.length > 0 ? images[0].url : placeholderTeam;

  return (
    <div className="grid grid-cols-[2fr_repeat(9,1fr)] gap-2 p-4 bg-primary-200 dark:bg-secondary-500 rounded-md mb-2 shadow">
      {columns.map((column) => {
        let value;

        if (column.key === "name") {
          return (
            <div key={column.key} className="flex items-center">
              <img
                src={logoUrl}
                alt={`${name} logo`}
                className="w-12 h-12 rounded-full mr-4"
              />
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {name}
              </span>
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
          <div key={column.key} className="flex items-center justify-center">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LolTeamRow;

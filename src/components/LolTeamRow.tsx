// src/components/LolTeamRow.tsx

import React from "react";
import { Team } from "src/schemas/team";
import { formatGold, formatStat, formatStreak } from "src/utils/esports";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import AutoFitText from "src/components/AutoFitText";
import { useTeamData } from "src/teams";
import { useTheme } from "src/hooks/useTheme";
import { Link } from "react-router-dom";

interface LolTeamRowProps {
  team: Team;
  columns: Array<{ label: string; key: string }>;
  gridTemplateColumns: string;
  esportName: string;
}

const LolTeamRow: React.FC<LolTeamRowProps> = ({
  team,
  columns,
  gridTemplateColumns,
  esportName,
}) => {
  const { name, images, aggStats } = team;

  const logoUrl = images && images.length > 0 ? images[0].url : placeholderTeam;

  // Get team color and logo type
  const getTeamData = useTeamData();
  const theme = useTheme();
  const { logoType } = getTeamData(name);
  const isPlaceholder = logoUrl === placeholderTeam;

  // Function to apply logo filter based on logo type and theme
  const getLogoFilter = (
    logoType: "black" | "white" | "color",
    isPlaceholder: boolean,
    currentTheme: string
  ): string => {
    if (isPlaceholder) {
      return "";
    }
    if (logoType === "black" && currentTheme === "dark") {
      return "invert";
    } else if (logoType === "white" && currentTheme === "light") {
      return "invert";
    }
    return "";
  };

  return (
    <Link to={`/esports/${esportName}/team/${team.id}`} className="block">
      <div
        className={`grid gap-0 p-2 bg-primary-200 dark:bg-secondary-800 rounded-md mb-1 shadow`}
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
                  src={logoUrl}
                  alt={`${name} logo`}
                  className={`w-10 h-10 rounded-full mr-4 ${getLogoFilter(
                    logoType,
                    isPlaceholder,
                    theme
                  )}`}
                />
                <AutoFitText
                  text={name}
                  maxFontSize={16}
                  minFontSize={10}
                  maxLines={1}
                  className="text-gray-800 dark:text-gray-200 font-bold"
                  style={{ flex: 1 }}
                  textAlign="left"
                />
              </div>
            );
          } else if (column.key === "seriesRecord") {
            const seriesWins = aggStats?.totalSeriesWins ?? 0;
            const seriesLosses = aggStats?.totalSeriesLosses ?? 0;
            value = `${seriesWins} - ${seriesLosses}`;
          } else if (column.key === "totalWins") {
            value = aggStats?.totalWins ?? 0;
          } else if (column.key === "totalLosses") {
            value = aggStats?.totalLosses ?? 0;
          } else if (column.key === "winRate") {
            const winRate = aggStats?.totalMatches
              ? (aggStats.totalWins / aggStats.totalMatches) * 100
              : 0;
            value = `${winRate.toFixed(2)}%`;
          } else if (column.key === "currentWinStreak") {
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
                statKey === "averageInhibitorsDestroyed" ||
                statKey === "averageDragonKills" ||
                statKey === "averageBaronKills" ||
                statKey === "averageHeraldKills" ||
                statKey === "averageVoidGrubKills"
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
    </Link>
  );
};

export default LolTeamRow;

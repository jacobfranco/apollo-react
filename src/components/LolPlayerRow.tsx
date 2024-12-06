// LolPlayerRow.tsx

import React from "react";
import { Player } from "src/schemas/player";
import { formatStat } from "src/utils/esports";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import AutoFitText from "src/components/AutoFitText";
import { Link } from "react-router-dom";
import { PlayerAggStats } from "src/schemas/player-agg-stats";
import { useTeamData } from "src/teams";
import { useTheme } from "src/hooks/useTheme";

interface PlayerWithComputedValues extends Player {
  computedValues: {
    kda: number;
    teamLogo: string;
  };
}

interface LolPlayerRowProps {
  player: PlayerWithComputedValues;
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
  const { nickName, aggStats, computedValues } = player;
  const { teamLogo } = computedValues;

  // Retrieve team name from player data if available.
  // If no team or name is provided, use a placeholder to get team data.
  const lastTeamId = player.teamIds?.[player.teamIds.length - 1];
  const teamName = player.teamIds && lastTeamId ? `Team${lastTeamId}` : "Team";

  const getTeamData = useTeamData();
  const { color: _teamColor, logoType } = getTeamData(teamName);
  const theme = useTheme();

  const isPlaceholder = teamLogo === "";

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
    <Link to={`/esports/${esportName}/player/${player.id}`} className="block">
      <div
        className="grid gap-0 p-2 bg-primary-200 dark:bg-secondary-500 rounded-md mb-1 shadow"
        style={{ gridTemplateColumns }}
      >
        {columns.map((column) => {
          let value;
          const isNameColumn = column.key === "name";
          const isTeamColumn = column.key === "teamName";

          if (isTeamColumn) {
            // Display only the team logo or placeholder with filtering
            return (
              <div
                key={column.key}
                className="flex items-center justify-center pr-2"
              >
                <img
                  src={teamLogo || placeholderTeam}
                  alt="Team logo"
                  className={`w-8 h-8 object-contain ${getLogoFilter(
                    logoType,
                    isPlaceholder,
                    theme
                  )}`}
                />
              </div>
            );
          }

          if (isNameColumn) {
            // Display player nickname
            return (
              <div
                key={column.key}
                className="flex items-center justify-start pr-2"
              >
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

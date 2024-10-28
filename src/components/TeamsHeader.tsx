import React from "react";
import { Team } from "src/schemas/team";
import AutoFitText from "./AutoFitText";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { useTeamColors } from "src/team-colors";
import { useTheme } from "src/hooks/useTheme";
import SvgIcon from "./SvgIcon";
import { formatGold } from "src/utils/scoreboards";

interface TeamsHeaderProps {
  team1: any;
  team2: any;
  team1Score: number;
  team2Score: number;
  matchDuration: string;
  matchLifecycle: string;
  series: any;
}

const TeamsHeader: React.FC<TeamsHeaderProps> = ({
  team1,
  team2,
  team1Score,
  team2Score,
  matchDuration,
  matchLifecycle,
  series,
}) => {
  const getTeamColorAndLogoType = useTeamColors();
  const theme = useTheme();

  const team1Team = team1.roster.team as Team | undefined;
  const team2Team = team2.roster.team as Team | undefined;

  const team1Name = team1Team?.name || "Team 1";
  const team2Name = team2Team?.name || "Team 2";

  const team1Logo = team1Team?.images?.[0]?.url || placeholderTeam;
  const team2Logo = team2Team?.images?.[0]?.url || placeholderTeam;

  const { color: team1Color, logoType: team1LogoType } =
    getTeamColorAndLogoType(team1Name);
  const { color: team2Color, logoType: team2LogoType } =
    getTeamColorAndLogoType(team2Name);

  const isTeam1Placeholder = team1Logo === placeholderTeam;
  const isTeam2Placeholder = team2Logo === placeholderTeam;

  const getLogoFilter = (
    logoType: "black" | "white" | "color",
    isPlaceholder: boolean,
    currentTheme: string
  ): string => {
    if (isPlaceholder) {
      return "";
    }
    if (logoType === "black" && currentTheme === "dark") {
      return "filter invert";
    } else if (logoType === "white" && currentTheme === "light") {
      return "filter invert";
    }
    return "";
  };

  // Calculate the number of rectangles (wins needed) based on bestOf
  const bestOf = series.format?.bestOf || 1;
  const winsNeeded = Math.ceil(bestOf / 2);

  // Function to render score rectangles for a team
  const renderScoreRectangles = (teamScore: number, teamColor: string) => {
    const rectangles = [];
    for (let i = 0; i < winsNeeded; i++) {
      rectangles.push(
        <div
          key={i}
          className="w-8 h-2 mx-0.5 rounded-sm"
          style={{
            backgroundColor:
              i < teamScore
                ? teamColor
                : theme === "light"
                ? "#e5e7eb" // Equivalent to bg-gray-300
                : "#374151", // Equivalent to bg-gray-700
          }}
        ></div>
      );
    }
    return <div className="flex justify-center mt-2">{rectangles}</div>;
  };

  // Get team stats
  const team1Stats = team1.stats || {};
  const team2Stats = team2.stats || {};

  const team1Kills = team1Stats.score || 0;
  const team2Kills = team2Stats.score || 0;

  const team1Gold = formatGold(team1Stats.goldEarned || 0);
  const team2Gold = formatGold(team2Stats.goldEarned || 0);

  const team1Towers = team1Stats.turretsDestroyed || 0;
  const team2Towers = team2Stats.turretsDestroyed || 0;

  return (
    <div className="flex justify-between items-start">
      {/* Team 1 */}
      <div className="flex flex-col items-start w-1/3">
        {/* Logo and name */}
        <div className="flex items-start">
          {/* Logo */}
          <div className="w-[75px] h-[75px]">
            <img
              className={`max-w-full max-h-full object-contain ${getLogoFilter(
                team1LogoType,
                isTeam1Placeholder,
                theme
              )}`}
              src={team1Logo}
              alt={team1Name}
            />
          </div>
          {/* Team Name */}
          <div className="ml-2">
            <AutoFitText
              text={team1Name}
              maxFontSize={16}
              minFontSize={8}
              maxLines={2}
              className="text-gray-900 dark:text-gray-100 font-bold"
              style={{ width: "100%", textAlign: "left" }}
            />
          </div>
        </div>
        {/* Score Rectangles */}
        {renderScoreRectangles(team1Score, team1Color)}
      </div>

      {/* Metrics Container */}
      <div className="flex flex-col items-center w-1/3 space-y-2">
        {/* Match Status */}
        <div className="font-bold opacity-60 text-red-500 dark:text-red-500">
          {matchLifecycle}
        </div>
        {/* Match Duration */}
        <div className="text-lg font-bold">{matchDuration}</div>
        {/* Kills Row */}
        <div className="flex items-center justify-between">
          {/* Team 1 Kills */}
          <div className="flex-1 text-right text-lg font-bold">
            {team1Kills}
          </div>
          {/* Kills Icon */}
          <div className="flex-shrink-0 mx-2">
            <SvgIcon
              src={require("@tabler/icons/outline/swords.svg")}
              className="h-6 w-6 text-primary-500"
            />
          </div>
          {/* Team 2 Kills */}
          <div className="flex-1 text-left text-lg font-bold">{team2Kills}</div>
        </div>

        {/* Gold Row */}
        <div className="flex items-center justify-between">
          {/* Team 1 Gold */}
          <div className="flex-1 text-right text-lg font-bold">{team1Gold}</div>
          {/* Gold Icon */}
          <div className="flex-shrink-0 mx-2">
            <SvgIcon
              src={require("@tabler/icons/outline/coins.svg")}
              className="h-6 w-6 text-primary-500"
            />
          </div>
          {/* Team 2 Gold */}
          <div className="flex-1 text-left text-lg font-bold">{team2Gold}</div>
        </div>

        {/* Towers Row */}
        <div className="flex items-center justify-between">
          {/* Team 1 Towers */}
          <div className="flex-1 text-right text-lg font-bold">
            {team1Towers}
          </div>
          {/* Towers Icon */}
          <div className="flex-shrink-0 mx-2">
            <SvgIcon
              src={require("@tabler/icons/outline/tower.svg")}
              className="h-6 w-6 text-primary-500"
            />
          </div>
          {/* Team 2 Towers */}
          <div className="flex-1 text-left text-lg font-bold">
            {team2Towers}
          </div>
        </div>
      </div>

      {/* Team 2 */}
      <div className="flex flex-col items-end w-1/3">
        {/* Logo and name */}
        <div className="flex items-start">
          {/* Team Name */}
          <div className="mr-2">
            <AutoFitText
              text={team2Name}
              maxFontSize={16}
              minFontSize={8}
              maxLines={2}
              className="text-gray-900 dark:text-gray-100 font-bold"
              style={{ width: "100%", textAlign: "right" }}
            />
          </div>
          {/* Logo */}
          <div className="w-[75px] h-[75px]">
            <img
              className={`max-w-full max-h-full object-contain ${getLogoFilter(
                team2LogoType,
                isTeam2Placeholder,
                theme
              )}`}
              src={team2Logo}
              alt={team2Name}
            />
          </div>
        </div>
        {/* Score Rectangles */}
        {renderScoreRectangles(team2Score, team2Color)}
      </div>
    </div>
  );
};

export default TeamsHeader;

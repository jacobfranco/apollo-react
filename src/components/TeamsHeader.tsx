// src/components/TeamsHeader.tsx

import React from "react";
import { Match } from "src/schemas/match";
import AutoFitText from "./AutoFitText";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { useTeamColors } from "src/team-colors";
import { useTheme } from "src/hooks/useTheme";
import SvgIcon from "./SvgIcon";
import { formatGold } from "src/utils/scoreboards";

interface TeamsHeaderProps {
  match: Match;
  bestOf: number;
  team1SeriesScore: number;
  team2SeriesScore: number;
}

const TeamsHeader: React.FC<TeamsHeaderProps> = ({
  match,
  bestOf,
  team1SeriesScore,
  team2SeriesScore,
}) => {
  const getTeamColorAndLogoType = useTeamColors();
  const theme = useTheme();

  // Extract teams data
  const [team1Participant, team2Participant] = match.participants;
  const team1 = team1Participant.roster.team;
  const team2 = team2Participant.roster.team;

  // Team names and logos
  const team1Name = team1?.name || "Team 1";
  const team2Name = team2?.name || "Team 2";
  const team1Logo = team1?.images?.[0]?.url || placeholderTeam;
  const team2Logo = team2?.images?.[0]?.url || placeholderTeam;

  // Team colors and logo types
  const { color: team1Color, logoType: team1LogoType } =
    getTeamColorAndLogoType(team1Name);
  const { color: team2Color, logoType: team2LogoType } =
    getTeamColorAndLogoType(team2Name);

  const isTeam1Placeholder = team1Logo === placeholderTeam;
  const isTeam2Placeholder = team2Logo === placeholderTeam;

  // Get match stats from team.matchStats
  const team1MatchStats = team1?.matchStats;
  const team2MatchStats = team2?.matchStats;

  // Match lifecycle and duration
  const matchLifecycle = match.lifecycle.toUpperCase();
  const matchDuration = match.clock
    ? formatDuration(match.clock.milliseconds / 1000) // Assuming milliseconds
    : "0:00";

  // **Calculate wins needed based on bestOf**
  const winsNeeded = Math.ceil(bestOf / 2);

  // **Function to render score rectangles for a team**
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
                ? "#e5e7eb"
                : "#374151",
          }}
        ></div>
      );
    }
    return (
      <div className="flex justify-center mt-4">
        {/* Increased margin-top */ rectangles}
      </div>
    );
  };

  // Get team match stats
  const team1Kills = team1MatchStats?.score || 0;
  const team2Kills = team2MatchStats?.score || 0;

  const team1Gold = formatGold(team1MatchStats?.goldEarned || 0);
  const team2Gold = formatGold(team2MatchStats?.goldEarned || 0);

  const team1Towers = team1MatchStats?.turretsDestroyed || 0;
  const team2Towers = team2MatchStats?.turretsDestroyed || 0;

  // **Determine status display**
  let statusDisplay = "";
  if (match.lifecycle === "over") {
    // Find the winning participant
    const winnerParticipant = match.participants.find(
      (participant) => participant.winner
    );

    if (winnerParticipant && winnerParticipant.roster.team) {
      const winnerTeam = winnerParticipant.roster.team;
      const winnerAbbr = winnerTeam.abbreviation || winnerTeam.name;
      statusDisplay = `${winnerAbbr} Win - ${matchDuration}`;
    } else {
      // Fallback if no winner is found
      statusDisplay = `Final - ${matchDuration}`;
    }
  } else if (match.lifecycle === "upcoming") {
    statusDisplay = "Upcoming";
  } else if (match.lifecycle === "live") {
    statusDisplay = "Live";
  }

  // **Helper function to determine text colors based on metric comparison**
  const getMetricClasses = (team1Value: number, team2Value: number) => {
    if (team1Value > team2Value) {
      return {
        team1Class: "text-black dark:text-white",
        team2Class: "text-gray-500",
      };
    } else if (team2Value > team1Value) {
      return {
        team1Class: "text-gray-500",
        team2Class: "text-black dark:text-white",
      };
    } else {
      // If values are equal, both are white
      return {
        team1Class: "text-black dark:text-white",
        team2Class: "text-black dark:text-white",
      };
    }
  };

  // Get classes for each metric
  const killsClasses = getMetricClasses(team1Kills, team2Kills);
  const goldClasses = getMetricClasses(
    team1MatchStats?.goldEarned || 0,
    team2MatchStats?.goldEarned || 0
  );
  const towersClasses = getMetricClasses(team1Towers, team2Towers);

  return (
    <div className="relative flex justify-between items-start pt-4 pb-6 space-x-8">
      {/* Added space-x-8 for horizontal spacing between sections */}

      {/* Team 1 */}
      <div className="flex flex-col items-center w-1/3">
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
        {/* **Series Score Rectangles** */}
        {renderScoreRectangles(team1SeriesScore, team1Color)}
        {/* Team Name */}
        <div className="mt-4">
          {/* Increased margin-top */}
          <AutoFitText
            text={team1Name}
            maxFontSize={16}
            minFontSize={8}
            maxLines={2}
            className="text-gray-900 dark:text-gray-100 font-bold text-center"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Metrics Container */}
      <div className="flex flex-col items-center w-1/3 space-y-4">
        {/* Increased space-y from 2 to 4 for more vertical spacing */}

        {/* Combined Status Display */}
        <div className="text-gray-500 font-bold">{statusDisplay}</div>

        {/* Kills Row */}
        <div className="flex items-center justify-between w-full">
          <div
            className={`flex-1 text-right text-lg font-bold ${killsClasses.team1Class}`}
          >
            {team1Kills}
          </div>
          <div className="flex-shrink-0 mx-2">
            <SvgIcon
              src={require("@tabler/icons/outline/swords.svg")}
              className="h-6 w-6 text-primary-500"
            />
          </div>
          <div
            className={`flex-1 text-left text-lg font-bold ${killsClasses.team2Class}`}
          >
            {team2Kills}
          </div>
        </div>

        {/* Gold Row */}
        <div className="flex items-center justify-between w-full">
          <div
            className={`flex-1 text-right text-lg font-bold ${goldClasses.team1Class}`}
          >
            {team1Gold}
          </div>
          <div className="flex-shrink-0 mx-2">
            <SvgIcon
              src={require("@tabler/icons/outline/coins.svg")}
              className="h-6 w-6 text-primary-500"
            />
          </div>
          <div
            className={`flex-1 text-left text-lg font-bold ${goldClasses.team2Class}`}
          >
            {team2Gold}
          </div>
        </div>

        {/* Towers Row */}
        <div className="flex items-center justify-between w-full">
          <div
            className={`flex-1 text-right text-lg font-bold ${towersClasses.team1Class}`}
          >
            {team1Towers}
          </div>
          <div className="flex-shrink-0 mx-2">
            <SvgIcon
              src={require("@tabler/icons/outline/tower.svg")}
              className="h-6 w-6 text-primary-500"
            />
          </div>
          <div
            className={`flex-1 text-left text-lg font-bold ${towersClasses.team2Class}`}
          >
            {team2Towers}
          </div>
        </div>
      </div>

      {/* Team 2 */}
      <div className="flex flex-col items-center w-1/3">
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
        {/* **Series Score Rectangles** */}
        {renderScoreRectangles(team2SeriesScore, team2Color)}
        {/* Team Name */}
        <div className="mt-4">
          {/* Increased margin-top */}
          <AutoFitText
            text={team2Name}
            maxFontSize={16}
            minFontSize={8}
            maxLines={2}
            className="text-gray-900 dark:text-gray-100 font-bold text-center"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Divider line */}
      <div className="absolute left-[5%] right-[5%] bottom-[5%] h-0.5 opacity-10 border-t border-solid border-gray-900 dark:border-gray-100" />
    </div>
  );
};

// Utility function to format duration
function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Helper function to apply logo filters based on theme
function getLogoFilter(
  logoType: "black" | "white" | "color",
  isPlaceholder: boolean,
  currentTheme: string
): string {
  if (isPlaceholder) {
    return "";
  }
  if (logoType === "black" && currentTheme === "dark") {
    return "filter invert";
  } else if (logoType === "white" && currentTheme === "light") {
    return "filter invert";
  }
  return "";
}

export default TeamsHeader;

import React from "react";
import { useAppSelector } from "src/hooks";
import { selectSeriesById } from "src/selectors";
import { useTeamData } from "src/teams";
import AutoFitText from "./AutoFitText";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { useTheme } from "src/hooks/useTheme";
import { formatScoreboardTitle } from "src/utils/esports";

interface LolScoreboardProps {
  seriesId: number;
}

const LolScoreboard: React.FC<LolScoreboardProps> = ({ seriesId }) => {
  const series = useAppSelector((state) => selectSeriesById(state, seriesId));

  if (!series) {
    return <div>Loading...</div>;
  }

  const { participants, lifecycle, start } = series;

  const formattedTitle = formatScoreboardTitle(series);

  const getTeamData = useTeamData();
  const theme = useTheme();

  const team1 = participants[0]?.roster?.team;
  const team2 = participants[1]?.roster?.team;

  const team1Name = team1?.name || "Team 1";
  const team2Name = team2?.name || "Team 2";

  const team1Logo = team1?.images?.[0]?.url || placeholderTeam;
  const team2Logo = team2?.images?.[0]?.url || placeholderTeam;

  const score1 = participants[0]?.score ?? 0;
  const score2 = participants[1]?.score ?? 0;

  const winningSide =
    score1 > score2 ? "left" : score2 > score1 ? "right" : null;

  const { color: team1Color, logoType: team1LogoType } = getTeamData(team1Name);
  const { color: team2Color, logoType: team2LogoType } = getTeamData(team2Name);

  const isTeam1Placeholder = team1Logo === placeholderTeam;
  const isTeam2Placeholder = team2Logo === placeholderTeam;

  const winningColor =
    winningSide === "left"
      ? team1Color
      : winningSide === "right"
      ? team2Color
      : "#A981FC";

  const bestOf = series.format?.bestOf ? `Best of ${series.format.bestOf}` : "";

  const startDate = new Date(start * 1000);
  const formattedStartDate = startDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  let score1Color = "text-gray-700 dark:text-gray-300";
  let score2Color = "text-gray-700 dark:text-gray-300";

  if (lifecycle === "over") {
    if (winningSide === "left") {
      score1Color = "text-gray-900 dark:text-gray-100";
    } else if (winningSide === "right") {
      score2Color = "text-gray-900 dark:text-gray-100";
    }
  } else {
    score1Color = "text-gray-900 dark:text-gray-100";
    score2Color = "text-gray-900 dark:text-gray-100";
  }

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
    <div
      className="relative block w-full aspect-[2.5] text-center font-sans transform transition-transform shadow-lg duration-200 ease-in-out hover:scale-105"
      style={{ textDecoration: "none" }}
    >
      <div className="absolute inset-0 rounded-[5px] bg-gradient-to-b from-white to-gray-400 dark:from-gray-800 dark:to-gray-900 opacity-10 border border-solid border-gray-500" />

      {winningSide && (
        <div
          className="absolute inset-0 rounded-[5px] opacity-50"
          style={{
            backgroundImage:
              winningSide === "left"
                ? `linear-gradient(to right, ${winningColor} 0%, ${winningColor} 5%, transparent 67.7%)`
                : `linear-gradient(to left, ${winningColor} 0%, ${winningColor} 5%, transparent 67.7%)`,
          }}
        />
      )}

      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-transparent rounded-b px-6 pb-2 pt-3 flex items-center justify-center"
        style={{
          minWidth: "35%",
          maxWidth: "100%",
          height: "10%",
        }}
      >
        <div className="text-gray-900 dark:text-gray-100 opacity-60 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {formattedTitle}
        </div>
      </div>

      <div className="absolute inset-x-0 top-[12%] bottom-[12%] flex flex-row items-center justify-between px-4">
        {/* Left Column */}
        <div className="flex flex-col items-center w-1/3">
          {/* Logo Container */}
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
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
          <div className="flex items-center justify-center space-x-1 mt-2 w-full">
            <AutoFitText
              text={team1Name}
              maxFontSize={16}
              minFontSize={8}
              maxLines={2}
              className="text-gray-900 dark:text-gray-100 font-normal"
              style={{ width: "100%", textAlign: "center" }}
            />
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col items-center w-1/3 justify-center space-y-6">
          {/* Time */}
          <div className="font-bold text-black dark:text-white mt-4">
            {lifecycle === "over" || lifecycle === "over-draw"
              ? "Final"
              : lifecycle === "upcoming"
              ? formattedStartDate
              : "Live"}
          </div>
          {/* Score */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`text-9xl font-bold ${score1Color}`}>{score1}</div>
            <div className="text-5xl font-bold opacity-80 text-gray-900 dark:text-gray-100">
              -
            </div>
            <div className={`text-9xl font-bold ${score2Color}`}>{score2}</div>
          </div>
          {/* Format */}
          <div className="font-bold opacity-80 text-black dark:text-white pb-1">
            {bestOf}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center w-1/3">
          {/* Logo Container */}
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
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
          {/* Team Name */}
          <div className="flex items-center justify-center space-x-1 mt-2 w-full">
            <AutoFitText
              text={team2Name}
              maxFontSize={16}
              minFontSize={8}
              maxLines={2}
              className="text-gray-900 dark:text-gray-100 font-normal"
              style={{ width: "100%", textAlign: "center" }}
            />
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="absolute left-[5%] right-[5%] bottom-[5%] h-0.5 opacity-10 border-t border-solid border-gray-900 dark:border-gray-100" />
    </div>
  );
};

export default LolScoreboard;

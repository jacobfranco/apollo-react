// src/components/LolLiveScoreboard.tsx

import React, { useEffect, useMemo } from "react";
import { useTeamData } from "src/teams";
import AutoFitText from "./AutoFitText";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import useLiveMatchStream from "src/api/hooks/useLiveMatchStream";
import { useAppSelector } from "src/hooks";
import { selectMatchById, selectSeriesById } from "src/selectors";
import { Participant, Team } from "src/schemas";
import { useTheme } from "src/hooks/useTheme";
import {
  formatScoreboardTitle,
  formatGold,
  getCoverageFact,
} from "src/utils/scoreboards";
import SvgIcon from "./SvgIcon";
import ScoreboardClock from "./ScoreboardClock"; // Import the new component

interface LolLiveScoreboardProps {
  seriesId: number;
}

const LolLiveScoreboard: React.FC<LolLiveScoreboardProps> = ({ seriesId }) => {
  const series = useAppSelector((state) => selectSeriesById(state, seriesId));

  if (!series) {
    return <div>Loading...</div>;
  }

  const formattedTitle = formatScoreboardTitle(series);

  const currentMatchId = useMemo(() => {
    if (!series.matchIds || series.matchIds.length === 0) {
      return null;
    }

    const totalScore = series.participants.reduce(
      (acc, participant) => acc + (participant.score || 0),
      0
    );
    const currentMatchIndex = totalScore;
    return series.matchIds[currentMatchIndex] || null;
  }, [series]);

  useLiveMatchStream(currentMatchId);

  const liveMatch = useAppSelector((state) =>
    currentMatchId ? selectMatchById(state, currentMatchId) : undefined
  );

  const coverageFact = getCoverageFact(liveMatch);

  useEffect(() => {
    console.log(
      `Component re-rendered. LiveMatch for matchId ${currentMatchId}:`,
      liveMatch
    );
  }, [liveMatch, currentMatchId]);

  const currentSeries = series;

  // Use participants from live match if coverage is available and participants are present, else use series participants
  const mergedParticipants: Participant[] = useMemo(() => {
    if (
      coverageFact === "available" &&
      liveMatch &&
      liveMatch.participants &&
      liveMatch.participants.length >= 2
    ) {
      return liveMatch.participants;
    } else {
      return currentSeries.participants || [];
    }
  }, [currentSeries.participants, liveMatch, coverageFact]);

  const lifecycle = liveMatch?.lifecycle || currentSeries.lifecycle;

  const start = currentSeries.start;

  const getTeamData = useTeamData();
  const theme = useTheme();

  if (mergedParticipants.length < 2) {
    return <div>Not enough participants</div>;
  }

  const team1Participant = mergedParticipants[0];
  const team2Participant = mergedParticipants[1];

  const team1 = team1Participant?.roster?.team as Team | undefined;
  const team2 = team2Participant?.roster?.team as Team | undefined;

  const team1Name = team1?.name || "Team 1";
  const team2Name = team2?.name || "Team 2";

  const team1Logo = team1?.images?.[0]?.url || placeholderTeam;
  const team2Logo = team2?.images?.[0]?.url || placeholderTeam;

  // Initialize match stats variables
  let team1Kills: number | string = "-";
  let team2Kills: number | string = "-";

  let team1Gold: string = "-";
  let team2Gold: string = "-";

  let team1Towers: number | string = "-";
  let team2Towers: number | string = "-";

  // Only populate stats if coverage is available
  if (coverageFact === "available") {
    const team1MatchStats = team1?.matchStats;
    const team2MatchStats = team2?.matchStats;

    team1Kills = team1MatchStats?.score ?? "-";
    team2Kills = team2MatchStats?.score ?? "-";

    team1Gold = formatGold(team1MatchStats?.goldEarned ?? 0);
    team2Gold = formatGold(team2MatchStats?.goldEarned ?? 0);

    team1Towers = team1MatchStats?.turretsDestroyed ?? "-";
    team2Towers = team2MatchStats?.turretsDestroyed ?? "-";
  }

  const { color: team1Color, logoType: team1LogoType } = getTeamData(team1Name);
  const { color: team2Color, logoType: team2LogoType } = getTeamData(team2Name);

  const isTeam1Placeholder = team1Logo === placeholderTeam;
  const isTeam2Placeholder = team2Logo === placeholderTeam;

  const bestOf = currentSeries.format?.bestOf || 1;

  const startDate = new Date(start * 1000);
  const formattedStartDate = startDate.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

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

  const winsNeeded = Math.ceil(bestOf / 2);

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
    return <div className="flex justify-center mt-2">{rectangles}</div>;
  };

  return (
    <div
      className="relative block w-full aspect-[2.5] text-center font-sans transform transition-transform duration-200 ease-in-out hover:scale-105"
      style={{ textDecoration: "none" }}
    >
      <div className="absolute inset-0 rounded-[5px] bg-gradient-to-b from-white to-gray-400 dark:from-gray-800 dark:to-gray-900 opacity-10 border border-solid border-gray-500" />

      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-primary-500 dark:bg-primary-600 rounded-b px-6 py-2 flex items-center justify-center"
        style={{
          minWidth: "35%",
          maxWidth: "100%",
          height: "10%",
        }}
      >
        <div className="text-black dark:text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {formattedTitle}
        </div>
      </div>

      <div className="absolute inset-x-0 top-[12%] bottom-[12%] flex flex-row items-center justify-between px-4">
        <div className="flex flex-col items-center w-1/3">
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-2">
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
          <div className="flex items-center justify-center space-x-1 mt-1 w-full">
            <AutoFitText
              text={team1Name}
              maxFontSize={16}
              minFontSize={8}
              maxLines={2}
              className="text-gray-900 dark:text-gray-100 font-normal"
              style={{ width: "100%", textAlign: "center" }}
            />
          </div>
          {renderScoreRectangles(team1Participant.score, team1Color)}
        </div>

        <div className="flex flex-col items-center w-1/3 justify-center space-y-2">
          <ScoreboardClock liveMatch={liveMatch} coverageFact={coverageFact} />
          {coverageFact === "available" ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right text-lg font-bold">
                  {team1Kills}
                </div>
                <div className="flex-shrink-0 mx-2">
                  <SvgIcon
                    src={require("@tabler/icons/outline/swords.svg")}
                    className="h-6 w-6 text-primary-500"
                  />
                </div>
                <div className="flex-1 text-left text-lg font-bold">
                  {team2Kills}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-right text-lg font-bold">
                  {team1Gold}
                </div>
                <div className="flex-shrink-0 mx-2">
                  <SvgIcon
                    src={require("@tabler/icons/outline/coins.svg")}
                    className="h-6 w-6 text-primary-500"
                  />
                </div>
                <div className="flex-1 text-left text-lg font-bold">
                  {team2Gold}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-right text-lg font-bold">
                  {team1Towers}
                </div>
                <div className="flex-shrink-0 mx-2">
                  <SvgIcon
                    src={require("@tabler/icons/outline/tower.svg")}
                    className="h-6 w-6 text-primary-500"
                  />
                </div>
                <div className="flex-1 text-left text-lg font-bold">
                  {team2Towers}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Stats are currently unavailable, please check again later
            </div>
          )}
        </div>

        <div className="flex flex-col items-center w-1/3">
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-2">
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
          <div className="flex items-center justify-center space-x-1 mt-1 w-full">
            <AutoFitText
              text={team2Name}
              maxFontSize={16}
              minFontSize={8}
              maxLines={2}
              className="text-gray-900 dark:text-gray-100 font-normal"
              style={{ width: "100%", textAlign: "center" }}
            />
          </div>
          {renderScoreRectangles(team2Participant.score, team2Color)}
        </div>
      </div>

      <div className="absolute left-[5%] right-[5%] bottom-[5%] h-0.5 opacity-10 border-t border-solid border-gray-900 dark:border-gray-100" />
    </div>
  );
};

export default LolLiveScoreboard;

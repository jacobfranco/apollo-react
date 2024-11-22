import React from "react";
import { List as ImmutableList, Map as ImmutableMap } from "immutable";
import { Match } from "src/schemas/match";
import AutoFitText from "./AutoFitText";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { useTeamData } from "src/teams";
import { useTheme } from "src/hooks/useTheme";
import SvgIcon from "./SvgIcon";
import { formatGold, getCoverageFact } from "src/utils/scoreboards";
import { TeamMatchStats } from "src/schemas/team-match-stats";
import { Series } from "src/schemas/series";
import TeamElites from "./TeamElites";
import ScoreboardClock from "./ScoreboardClock";
import { openModal } from "src/actions/modals";
import { useAppDispatch } from "src/hooks/useAppDispatch";

interface TeamsHeaderProps {
  match?: Match;
  series: Series;
  bestOf: number;
  team1SeriesScore: number;
  team2SeriesScore: number;
}

const TeamsHeader: React.FC<TeamsHeaderProps> = ({
  match,
  series,
  bestOf,
  team1SeriesScore,
  team2SeriesScore,
}) => {
  const dispatch = useAppDispatch();
  const getTeamData = useTeamData();
  const theme = useTheme();

  const coverageFact = getCoverageFact(match);

  // Use participants from match if coverage is available and participants are present, else use series participants
  const participants =
    coverageFact === "available" &&
    match?.participants &&
    match.participants.length >= 2
      ? match.participants
      : series.participants || [];

  if (participants.length < 2) {
    // Handle the case where there are not enough participants
    return <div>Not enough participants</div>;
  }

  const [team1Participant, team2Participant] = participants;

  // Use optional chaining and default values
  const team1 = team1Participant.roster?.team;
  const team2 = team2Participant.roster?.team;

  // Team names and logos
  const team1Name = team1?.name || "Team 1";
  const team2Name = team2?.name || "Team 2";
  const team1Logo = team1?.images?.[0]?.url || placeholderTeam;
  const team2Logo = team2?.images?.[0]?.url || placeholderTeam;

  // Team colors and logo types
  const { color: team1Color, logoType: team1LogoType } = getTeamData(team1Name);
  const { color: team2Color, logoType: team2LogoType } = getTeamData(team2Name);

  const isTeam1Placeholder = team1Logo === placeholderTeam;
  const isTeam2Placeholder = team2Logo === placeholderTeam;

  // Get match stats from team.matchStats if coverage is available
  let team1MatchStats: TeamMatchStats | null | undefined = null;
  let team2MatchStats: TeamMatchStats | null | undefined = null;

  if (coverageFact === "available") {
    team1MatchStats = team1?.matchStats;
    team2MatchStats = team2?.matchStats;
  }

  // Match lifecycle and duration
  const matchDuration =
    match?.clock && match.clock.milliseconds
      ? formatDuration(match.clock.milliseconds / 1000)
      : "0:00";

  // Calculate wins needed based on bestOf
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

  type StatValue = number | string;

  // Get team match stats or use '-' if not available
  const team1Kills: StatValue = team1MatchStats?.score ?? "-";
  const team2Kills: StatValue = team2MatchStats?.score ?? "-";

  const team1GoldValue: number | undefined = team1MatchStats?.goldEarned;
  const team2GoldValue: number | undefined = team2MatchStats?.goldEarned;

  const team1Gold: string =
    team1GoldValue !== undefined ? formatGold(team1GoldValue) : "-";
  const team2Gold: string =
    team2GoldValue !== undefined ? formatGold(team2GoldValue) : "-";

  const team1Towers: StatValue = team1MatchStats?.turretsDestroyed ?? "-";
  const team2Towers: StatValue = team2MatchStats?.turretsDestroyed ?? "-";

  const team1Inhibitors: StatValue =
    team1MatchStats?.inhibitorsDestroyed ?? "-";
  const team2Inhibitors: StatValue =
    team2MatchStats?.inhibitorsDestroyed ?? "-";

  const team1EliteCreepsKills = team1MatchStats?.creeps.neutrals;
  const team2EliteCreepsKills = team2MatchStats?.creeps.neutrals;

  // Determine status display
  let statusDisplay = "";

  if (match?.lifecycle === "over") {
    // Existing logic for when match is over
    const winnerParticipant = match.participants.find(
      (participant) => participant.winner
    );

    if (winnerParticipant && winnerParticipant.roster?.team) {
      const winnerTeam = winnerParticipant.roster.team;
      const winnerAbbr = winnerTeam.abbreviation || winnerTeam.name;
      statusDisplay = `${winnerAbbr} Win - ${matchDuration}`;
    } else {
      // Fallback if no winner is found
      statusDisplay = `Final - ${matchDuration}`;
    }
  } else if (match?.lifecycle === "live") {
    statusDisplay = "Live";
  } else if (match?.lifecycle === "upcoming" || !match) {
    // Display the scheduled date and time
    const startTime = series.start ? new Date(series.start * 1000) : null;
    statusDisplay = startTime ? `${formatDateTime(startTime)}` : "Upcoming";
  }

  // Helper function to determine text colors based on metric comparison
  const getMetricClasses = (
    team1Value: number | string,
    team2Value: number | string
  ) => {
    if (typeof team1Value !== "number" || typeof team2Value !== "number") {
      return {
        team1Class: "text-gray-500",
        team2Class: "text-gray-500",
      };
    }

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
      // If values are equal, both are highlighted
      return {
        team1Class: "text-black dark:text-white",
        team2Class: "text-black dark:text-white",
      };
    }
  };

  // Get classes for each metric
  const killsClasses = getMetricClasses(team1Kills, team2Kills);
  const goldClasses = getMetricClasses(
    team1GoldValue ?? "-",
    team2GoldValue ?? "-"
  );
  const towersClasses = getMetricClasses(team1Towers, team2Towers);
  const inhibitorsClasses = getMetricClasses(team1Inhibitors, team2Inhibitors);

  // Function to handle opening the stream modal
  const handleOpenStream = () => {
    if (series.broadcasters && series.broadcasters.length > 0) {
      // Create attachment objects representing the streams
      const streamAttachments = series.broadcasters.map((broadcaster) => ({
        id: `stream-${broadcaster.broadcasterId}`,
        type: "stream",
        url: null,
        preview_url: null, // You can set a logo or placeholder if available
        remote_url: null,
        description: broadcaster.broadcasterName,
        blurhash: null,
        meta: ImmutableMap(), // Ensure meta is initialized
        broadcaster,
      }));

      // Dispatch an action to open MediaModal with these attachments
      dispatch(
        openModal("MEDIA", {
          media: ImmutableList(streamAttachments),
          index: 0,
        })
      );
    } else {
      // Handle cases with no broadcasters if necessary
    }
  };

  return (
    <div className="relative flex justify-between items-start pt-4 pb-6 space-x-8">
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
        {/* Series Score Rectangles */}
        {renderScoreRectangles(team1SeriesScore, team1Color)}
        {/* Team Name */}
        <div className="mt-4">
          <AutoFitText
            text={team1Name}
            maxFontSize={16}
            minFontSize={8}
            maxLines={2}
            className="text-gray-900 dark:text-gray-100 font-bold text-center"
            style={{ width: "100%" }}
          />
        </div>
        {/* Team Elites with added padding */}
        {coverageFact === "available" && team1EliteCreepsKills && (
          <TeamElites
            creepsKills={team1EliteCreepsKills}
            teamSide="left"
            theme={theme}
            className="mt-4 mb-2"
          />
        )}
      </div>

      {/* Metrics Container */}
      <div className="flex flex-col items-center w-1/3 space-y-4">
        {match?.lifecycle === "live" ? (
          <ScoreboardClock liveMatch={match} coverageFact={coverageFact} />
        ) : (
          <div className="text-gray-500 font-bold">{statusDisplay}</div>
        )}

        {coverageFact === "available" ? (
          <>
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

            {/* Inhibitors Destroyed Row */}
            <div className="flex items-center justify-between w-full">
              <div
                className={`flex-1 text-right text-lg font-bold ${inhibitorsClasses.team1Class}`}
              >
                {team1Inhibitors}
              </div>
              <div className="flex-shrink-0 mx-2">
                <SvgIcon
                  src={require("@tabler/icons/outline/focus.svg")}
                  className="h-6 w-6 text-primary-500"
                />
              </div>
              <div
                className={`flex-1 text-left text-lg font-bold ${inhibitorsClasses.team2Class}`}
              >
                {team2Inhibitors}
              </div>
            </div>

            {/* Stream Button */}
            {series.broadcasters && series.broadcasters.length > 0 && (
              <div className="flex justify-center my- pb-2">
                <button
                  onClick={handleOpenStream}
                  className="px-4 py-2 bg-primary-300 dark:bg-secondary-600 rounded text-black dark:text-white hover:bg-primary-500 dark:hover:bg-secondary-800 focus:outline-none border dark:border-primary-700"
                >
                  Watch
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-500">
            Stats are currently unavailable, please check again later
          </div>
        )}
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
        {/* Series Score Rectangles */}
        {renderScoreRectangles(team2SeriesScore, team2Color)}
        {/* Team Name */}
        <div className="mt-4">
          <AutoFitText
            text={team2Name}
            maxFontSize={16}
            minFontSize={8}
            maxLines={2}
            className="text-gray-900 dark:text-gray-100 font-bold text-center"
            style={{ width: "100%" }}
          />
        </div>
        {/* Team Elites with added padding */}
        {coverageFact === "available" && team2EliteCreepsKills && (
          <TeamElites
            creepsKills={team2EliteCreepsKills}
            teamSide="right"
            theme={theme}
            className="mt-4 mb-2"
          />
        )}
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

// Function to format date and time
function formatDateTime(date: Date): string {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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

import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import {
  selectTeamById,
  selectTeamLoading,
  selectTeamError,
} from "src/selectors";
import { fetchTeamById } from "src/actions/teams";
import { Card, CardBody, CardHeader, CardTitle } from "src/components/Card";
import { Column } from "src/components/Column";
import SvgIcon from "src/components/SvgIcon";
import placeholderTeam from "src/assets/images/placeholder-team.png";
import { formatStreak, formatStat, formatGold } from "src/utils/scoreboards";
import { TeamAggStats } from "src/schemas/team-agg-stats";
import { useTheme } from "src/hooks/useTheme"; // Import useTheme
import { useTeamData } from "src/teams"; // Import useTeamData

type TeamDetailParams = {
  esportName: string;
  teamId: string;
};

type StatEntry = {
  label: string;
  avgKey: keyof TeamAggStats;
  totalKey: keyof TeamAggStats;
  formatter: (value: number) => string;
};

const TeamDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName, teamId } = useParams<TeamDetailParams>();
  const teamIdNumber = Number(teamId);

  const team = useAppSelector((state) => selectTeamById(state, teamIdNumber));
  const loading = useAppSelector((state) =>
    selectTeamLoading(state, teamIdNumber)
  );
  const error = useAppSelector((state) => selectTeamError(state, teamIdNumber));

  React.useEffect(() => {
    if (!team && !loading) {
      dispatch(fetchTeamById(esportName, teamIdNumber));
    }
  }, [dispatch, team, loading, esportName, teamIdNumber]);

  if (loading || !team) {
    return <div className="p-4">Loading team data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // Use the useTeamData hook to get team-specific data
  const getTeamData = useTeamData();
  const { color, logoType, league } = getTeamData(team.name);

  const logoUrl =
    team.images && team.images.length > 0
      ? team.images[0].url
      : placeholderTeam;
  const countryFlag = team.region?.country?.images?.[0]?.url;

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return (
          <SvgIcon
            src={require("@tabler/icons/outline/brand-twitter.svg")}
            className="h-5 w-5 text-gray-600 hover:text-blue-500"
          />
        );
      case "twitch":
        return (
          <SvgIcon
            src={require("@tabler/icons/outline/brand-twitch.svg")}
            className="h-5 w-5 text-gray-600 hover:text-purple-500"
          />
        );
      case "youtube":
        return (
          <SvgIcon
            src={require("@tabler/icons/outline/brand-youtube.svg")}
            className="h-5 w-5 text-gray-600 hover:text-red-500"
          />
        );
      default:
        return (
          <SvgIcon
            src={require("@tabler/icons/outline/world.svg")}
            className="h-5 w-5 text-gray-600 hover:text-blue-500"
          />
        );
    }
  };

  // State for toggling between per-match averages and totals
  const [showAverages, setShowAverages] = React.useState(true);

  // Handler for toggle button
  const handleToggle = () => {
    setShowAverages((prev) => !prev);
  };

  // Access aggStats
  const aggStats = team.aggStats;

  const theme = useTheme(); // Get current theme

  // Define getLogoFilter function
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

  // Calculate Win Percentage
  const winPercentage =
    aggStats && aggStats.totalMatches > 0
      ? ((aggStats.totalWins / aggStats.totalMatches) * 100).toFixed(2) + "%"
      : "0%";

  // Statistics configuration with properly typed keys
  const stats: StatEntry[] = [
    {
      label: "Gold",
      avgKey: "averageGoldEarned",
      totalKey: "totalGoldEarned",
      formatter: formatGold,
    },
    {
      label: "Kills",
      avgKey: "averageScore",
      totalKey: "totalScore",
      formatter: formatStat,
    },
    {
      label: "Turrets",
      avgKey: "averageTurretsDestroyed",
      totalKey: "totalTurretsDestroyed",
      formatter: formatStat,
    },
    {
      label: "Inhibitors",
      avgKey: "averageInhibitorsDestroyed",
      totalKey: "totalInhibitorsDestroyed",
      formatter: formatStat,
    },
    {
      label: "Dragons",
      avgKey: "averageDragonKills",
      totalKey: "totalDragonKills",
      formatter: formatStat,
    },
    {
      label: "Barons",
      avgKey: "averageBaronKills",
      totalKey: "totalBaronKills",
      formatter: formatStat,
    },
    {
      label: "Heralds",
      avgKey: "averageHeraldKills",
      totalKey: "totalHeraldKills",
      formatter: formatStat,
    },
    {
      label: "Void Grubs",
      avgKey: "averageVoidGrubKills",
      totalKey: "totalVoidGrubKills",
      formatter: formatStat,
    },
  ];

  return (
    <Column
      label=""
      backHref={`/${esportName}/teams`}
      className="max-w-6xl mx-auto"
    >
      <div className="space-y-6 p-4">
        {/* Header Section with Team Info and Basic Stats */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Team Info Card */}
          <Card className="flex-1">
            <CardBody className="bg-primary-200 dark:bg-secondary-500 rounded-md">
              <div className="flex items-start">
                {/* Logo */}
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt={`${team.name} logo`}
                    className={`w-full h-full object-contain ${getLogoFilter(
                      logoType,
                      logoUrl === placeholderTeam,
                      theme
                    )}`}
                  />
                </div>
                {/* Info */}
                <div className="flex flex-col space-y-2 ml-4 flex-1">
                  {/* Modified Section: Team Name and Series Record arranged vertically */}
                  <div className="flex flex-col items-start space-y-1 w-full">
                    {/* Team Name and Abbreviation on the same line */}
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        {team.name}
                      </span>
                      {team.abbreviation && (
                        <span className="text-gray-500">
                          ({team.abbreviation})
                        </span>
                      )}
                    </div>
                    {/* Series Record underneath the team name */}
                    {aggStats && (
                      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Series Record: {aggStats.totalSeriesWins} -{" "}
                        {aggStats.totalSeriesLosses}
                      </div>
                    )}
                  </div>
                  {/* End of Modified Section */}

                  {/* Country and League Information */}
                  {team.region?.country && (
                    <div className="flex items-center space-x-2">
                      {countryFlag && (
                        <img
                          src={countryFlag}
                          alt={`${team.region.country.name} flag`}
                          className="w-6 h-4 object-cover"
                        />
                      )}
                      <span>{team.region.country.name}</span>
                      {league && (
                        <span className="text-gray-500">| {league}</span>
                      )}
                    </div>
                  )}

                  {/* Social Media */}
                  {team.socialMediaAccounts &&
                    team.socialMediaAccounts.length > 0 && (
                      <div className="mt-2 flex space-x-4">
                        {team.socialMediaAccounts.map((account) => (
                          <a
                            key={account.url}
                            href={account.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {getSocialIcon(account.platform.name)}
                          </a>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Updated Basic Stats Card: Match Record, Win Percentage, Streak */}
          {aggStats && (
            <Card className="flex-1">
              <CardBody className="bg-primary-200 dark:bg-secondary-500 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
                  {/* Match Record */}
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Match Record
                    </div>
                    <div className="text-lg font-semibold">
                      {aggStats.totalWins} - {aggStats.totalLosses}
                    </div>
                  </div>
                  {/* Win Percentage */}
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Win Percentage
                    </div>
                    <div className="text-lg font-semibold">{winPercentage}</div>
                  </div>
                  {/* Current Streak */}
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Current Streak
                    </div>
                    <div className="text-lg font-semibold">
                      {formatStreak(aggStats.currentWinStreak)}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Statistics Section with Toggle Button */}
        {aggStats ? (
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
              <CardTitle title="Statistics" />
              <button
                onClick={handleToggle}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {showAverages ? "Show Totals" : "Show Averages"}
              </button>
            </CardHeader>
            <CardBody className="bg-primary-200 dark:bg-secondary-500 rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-8 gap-6 p-4">
                {stats.map(({ label, avgKey, totalKey, formatter }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                      {formatter(
                        aggStats[showAverages ? avgKey : totalKey] || 0
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ) : null}

        {/* Roster Section */}
        <Card>
          <CardHeader>
            <CardTitle title="Roster" />
          </CardHeader>
          <CardBody className="bg-primary-200 dark:bg-secondary-500 rounded-md">
            <p className="text-gray-500">
              Standing Roster ID:{" "}
              {team.standingRoster?.id || "No roster available"}
            </p>
          </CardBody>
        </Card>

        {/* Series History Section */}
        <Card>
          <CardHeader>
            <CardTitle title="Series History" />
          </CardHeader>
          <CardBody className="bg-primary-200 dark:bg-secondary-500 rounded-md">
            <p className="text-gray-500">No series history available</p>
          </CardBody>
        </Card>
      </div>
    </Column>
  );
};

export default TeamDetail;

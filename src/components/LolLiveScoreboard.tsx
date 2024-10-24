import React, { useEffect, useMemo } from 'react';
import { useTeamColors } from 'src/team-colors';
import AutoFitText from './AutoFitText';
import placeholderTeam from 'src/assets/images/placeholder-team.png';
import useLiveMatchStream from 'src/api/hooks/useLiveMatchStream';
import { useAppSelector } from 'src/hooks';
import { selectMatchById } from 'src/selectors';
import { Participant, Team } from 'src/schemas';
import { useTheme } from 'src/hooks/useTheme';
import { formatScoreboardTitle, formatGold } from 'src/utils/scoreboards';
import SvgIcon from './SvgIcon';
import { selectSeriesById } from 'src/selectors';

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
      0,
    );
    const currentMatchIndex = totalScore;
    return series.matchIds[currentMatchIndex] || null;
  }, [series]);

  useLiveMatchStream(currentMatchId);

  const liveMatch = useAppSelector((state) =>
    currentMatchId ? selectMatchById(state, currentMatchId) : undefined,
  );

  useEffect(() => {
    console.log(`Component re-rendered. LiveMatch for matchId ${currentMatchId}:`, liveMatch);
  }, [liveMatch, currentMatchId]);

  const currentSeries = series;

  const mergedParticipants: Participant[] = useMemo(() => {
    if (!liveMatch) return currentSeries.participants;

    return currentSeries.participants.map((seriesParticipant: Participant) => {
      const liveParticipant = liveMatch.participants.find(
        (lp: Participant) => lp.seed === seriesParticipant.seed,
      );

      if (liveParticipant) {
        return {
          ...seriesParticipant,
          roster: {
            ...liveParticipant.roster,
            players: liveParticipant.roster.players || [],
          },
        };
      } else {
        return seriesParticipant;
      }
    });
  }, [currentSeries.participants, liveMatch]);

  const lifecycle = liveMatch?.lifecycle || currentSeries.lifecycle;

  const start = currentSeries.start;

  const getTeamColorAndLogoType = useTeamColors();
  const theme = useTheme();

  const team1 = mergedParticipants[0]?.roster?.team as Team | undefined;
  const team2 = mergedParticipants[1]?.roster?.team as Team | undefined;

  const team1Name = team1?.name || 'Team 1';
  const team2Name = team2?.name || 'Team 2';

  const team1Logo = team1?.images?.[0]?.url || placeholderTeam;
  const team2Logo = team2?.images?.[0]?.url || placeholderTeam;

  const team1Kills = useMemo(() => {
    return team1?.matchStats?.score ?? 0;
  }, [team1]);

  const team2Kills = useMemo(() => {
    return team2?.matchStats?.score ?? 0;
  }, [team2]);

  const team1Gold = useMemo(() => formatGold(team1?.matchStats?.goldEarned ?? 0), [team1]);
  const team2Gold = useMemo(() => formatGold(team2?.matchStats?.goldEarned ?? 0), [team2]);

  const team1Towers = useMemo(() => team1?.matchStats?.turretsDestroyed ?? 0, [team1]);
  const team2Towers = useMemo(() => team2?.matchStats?.turretsDestroyed ?? 0, [team2]);

  const leadingSide =
    team1Kills > team2Kills ? 'left' : team2Kills > team1Kills ? 'right' : null;

  const { color: team1Color, logoType: team1LogoType } = getTeamColorAndLogoType(team1Name);
  const { color: team2Color, logoType: team2LogoType } = getTeamColorAndLogoType(team2Name);

  const isTeam1Placeholder = team1Logo === placeholderTeam;
  const isTeam2Placeholder = team2Logo === placeholderTeam;

  const bestOf = currentSeries.format?.bestOf ? `Best of ${currentSeries.format.bestOf}` : '';

  const startDate = new Date(start * 1000);
  const formattedStartDate = startDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const getLogoFilter = (
    logoType: 'black' | 'white' | 'color',
    isPlaceholder: boolean,
    currentTheme: string,
  ): string => {
    if (isPlaceholder) {
      return '';
    }
    if (logoType === 'black' && currentTheme === 'dark') {
      return 'invert';
    } else if (logoType === 'white' && currentTheme === 'light') {
      return 'invert';
    }
    return '';
  };

  return (
    <div
      className="relative block w-full aspect-[2.5] text-center font-sans transform transition-transform duration-200 ease-in-out hover:scale-105"
      style={{ textDecoration: 'none' }}
    >
      <div className="absolute inset-0 rounded-[5px] bg-gradient-to-b from-white to-gray-400 dark:from-gray-800 dark:to-gray-900 opacity-10 border border-solid border-gray-500" />

      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-primary-500 dark:bg-primary-600 rounded-b px-6 py-2 flex items-center justify-center"
        style={{
          minWidth: '35%',
          maxWidth: '100%',
          height: '10%',
        }}
      >
        <div className="text-black dark:text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis">
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
                theme,
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
              style={{ width: '100%', textAlign: 'center' }}
            />
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col items-center w-1/3 justify-center space-y-2">
          {/* Time */}
          <div className="font-bold opacity-60 text-red-500 dark:text-red-500">Live</div>

          {/* Metrics Container */}
          <div className="flex flex-col space-y-2">
            {/* Kills Row */}
            <div className="flex items-center justify-between">
              {/* Team 1 Kills */}
              <div className="flex-1 text-right">{team1Kills}</div>
              {/* Kills Icon */}
              <div className="flex-shrink-0 mx-2">
                <SvgIcon
                  src={require('@tabler/icons/outline/swords.svg')}
                  className="h-5 w-5 text-primary-500"
                />
              </div>
              {/* Team 2 Kills */}
              <div className="flex-1 text-left">{team2Kills}</div>
            </div>

            {/* Gold Row */}
            <div className="flex items-center justify-between">
              {/* Team 1 Gold */}
              <div className="flex-1 text-right">{team1Gold}</div>
              {/* Gold Icon */}
              <div className="flex-shrink-0 mx-2">
                <SvgIcon
                  src={require('@tabler/icons/outline/coin.svg')}
                  className="h-5 w-5 text-primary-500"
                />
              </div>
              {/* Team 2 Gold */}
              <div className="flex-1 text-left">{team2Gold}</div>
            </div>

            {/* Towers Row */}
            <div className="flex items-center justify-between">
              {/* Team 1 Towers */}
              <div className="flex-1 text-right">{team1Towers}</div>
              {/* Towers Icon */}
              <div className="flex-shrink-0 mx-2">
                <SvgIcon
                  src={require('@tabler/icons/outline/tower.svg')}
                  className="h-5 w-5 text-primary-500"
                />
              </div>
              {/* Team 2 Towers */}
              <div className="flex-1 text-left">{team2Towers}</div>
            </div>
          </div>

          {/* Format */}
          <div className="font-bold opacity-60 text-gray-900 dark:text-gray-100">{bestOf}</div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center w-1/3">
          {/* Logo Container */}
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
            <img
              className={`max-w-full max-h-full object-contain ${getLogoFilter(
                team2LogoType,
                isTeam2Placeholder,
                theme,
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
              style={{ width: '100%', textAlign: 'center' }}
            />
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="absolute left-[5%] right-[5%] bottom-[5%] h-0.5 opacity-10 border-t border-solid border-gray-900 dark:border-gray-100" />
    </div>
  );
};

export default LolLiveScoreboard;

// src/components/LolLiveScoreboard.tsx

import React, { useEffect, useMemo } from 'react';
import { LiveMatch } from 'src/types/entities';
import { useTeamColors } from 'src/team-colors';
import AutoFitText from './AutoFitText';
import placeholderTeam from 'src/assets/images/placeholder-team.png';
import useLiveMatchStream from 'src/api/hooks/useLiveMatchStream';
import { useAppSelector } from 'src/hooks';
import { selectLiveMatchById } from 'src/selectors';
import { Participant, Player, Series, Team } from 'src/schemas';

interface LolLiveScoreboardProps {
  series: Series; // Ensure Series type is correctly defined
}

const LolLiveScoreboard: React.FC<LolLiveScoreboardProps> = ({ series }) => {
  // 1. Determine the current live matchId
  const matchId = useMemo(() => {
    if (!series.matchIds || series.matchIds.length === 0) {
      console.warn('No matchIds available in series:', series);
      return null;
    }

    // Logic to determine the current match index
    const totalScore = series.participants.reduce(
      (acc: number, participant: any) => acc + participant.score,
      0
    );
    const currentMatchIndex = totalScore;

    // Ensure the index is within bounds
    if (currentMatchIndex >= series.matchIds.length) {
      console.warn(
        `Calculated match index ${currentMatchIndex} exceeds available matchIds.`
      );
      return null;
    }

    const currentMatchId = series.matchIds[currentMatchIndex];
    console.log(`Determined matchId for live scoreboard: ${currentMatchId}`);
    return currentMatchId;
  }, [series]);

  // 2. Establish WebSocket connection if matchId is valid
  useLiveMatchStream(matchId);

  // 3. Select the live match data from the Redux store
  const liveMatch: LiveMatch | undefined = useAppSelector((state) =>
    matchId ? selectLiveMatchById(state, matchId) : undefined
  );

  useEffect(() => {
    console.log(`Component re-rendered. LiveMatch for matchId ${matchId}:`, liveMatch);
  }, [liveMatch, matchId]);

  // 4. Log the liveMatch object for debugging
  console.log(`Received liveMatch for matchId ${matchId}:`, liveMatch);

  // 5. Use series data as base
  const currentSeries = series;

  // 6. Merge participants
  const mergedParticipants: Participant[] = useMemo(() => {
    if (!liveMatch) return currentSeries.participants;

    return currentSeries.participants.map((seriesParticipant: Participant) => {
      // Match participants by seed or another unique identifier
      const liveParticipant = liveMatch.participants.find(
        (lp: Participant) => lp.seed === seriesParticipant.seed
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

  // 7. Update lifecycle
  const lifecycle = liveMatch?.lifecycle || currentSeries.lifecycle;

  // 8. Proceed with rendering using mergedParticipants and updated lifecycle

  const start = currentSeries.start;

  const getTeamColor = useTeamColors();

  // Extract team and participant data
  const team1 = mergedParticipants[0]?.roster?.team as Team | undefined;
  const team2 = mergedParticipants[1]?.roster?.team as Team | undefined;

  const team1Name = team1?.name || 'Team 1';
  const team2Name = team2?.name || 'Team 2';

  const team1Logo = team1?.images?.[0]?.url || placeholderTeam;
  const team2Logo = team2?.images?.[0]?.url || placeholderTeam;

  // 9. Calculate team1Kills by accessing matchStats.score
  const team1Kills = useMemo(() => {
    return team1?.matchStats?.score ?? 0;
  }, [team1]);

  // 10. Calculate team2Kills by accessing matchStats.score
  const team2Kills = useMemo(() => {
    return team2?.matchStats?.score ?? 0;
  }, [team2]);

  // 11. Access team-level stats
  const team1Gold = team1?.matchStats?.goldEarned ?? 0;
  const team2Gold = team2?.matchStats?.goldEarned ?? 0;

  const team1Towers = team1?.matchStats?.turretsDestroyed ?? 0;
  const team2Towers = team2?.matchStats?.turretsDestroyed ?? 0;

  // Determine the leading side based on Kills
  const leadingSide =
    team1Kills > team2Kills ? 'left' : team2Kills > team1Kills ? 'right' : null;

  // Get team colors from the mapping, default to a color if not found
  const team1Color = getTeamColor(team1Name);
  const team2Color = getTeamColor(team2Name);

  // Leading color (use team color)
  const leadingColor =
    leadingSide === 'left'
      ? team1Color
      : leadingSide === 'right'
        ? team2Color
        : '#A981FC';

  // Format string
  const bestOf = currentSeries.format?.bestOf
    ? `Best of ${currentSeries.format.bestOf}`
    : '';

  // Format the start date
  const startDate = new Date(start * 1000);
  const formattedStartDate = startDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  // Adjust metric colors based on lifecycle
  let metricColor = 'text-gray-700 dark:text-gray-300';

  if (lifecycle === 'over') {
    metricColor = leadingSide
      ? 'text-gray-900 dark:text-gray-100'
      : 'text-gray-700 dark:text-gray-300';
  } else {
    // For live or upcoming matches, metrics are dark mode responsive
    metricColor = 'text-gray-900 dark:text-gray-100';
  }

  return (
    <div
      className="relative block w-full aspect-[2.5] text-center font-sans transform transition-transform duration-200 ease-in-out hover:scale-105"
      style={{ textDecoration: 'none' }}
    >
      {/* Background and border styles */}
      <div className="absolute inset-0 rounded-[5px] bg-gradient-to-b from-white to-gray-400 dark:from-gray-800 dark:to-gray-900 opacity-10 border border-solid border-gray-500" />

      {/* Leading gradient overlay */}
      {leadingSide && (
        <div
          className="absolute inset-0 rounded-[5px] opacity-50"
          style={{
            backgroundImage:
              leadingSide === 'left'
                ? `linear-gradient(to right, ${leadingColor}, transparent)`
                : `linear-gradient(to left, ${leadingColor}, transparent)`,
          }}
        />
      )}

      {/* Title box at the top */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-primary-500 dark:bg-primary-600 rounded-b px-6 py-2 flex items-center justify-center"
        style={{
          minWidth: '35%', // Maintained minWidth
          maxWidth: '100%',
          height: '10%', // Slightly increased height for better visibility
        }}
      >
        <div className="text-black dark:text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {currentSeries.title}
        </div>
      </div>

      {/* Flex container for the content */}
      <div className="absolute inset-x-0 top-[12%] bottom-[12%] flex flex-row items-center justify-between px-4">
        {/* Left Column */}
        <div className="flex flex-col items-center w-1/3">
          {/* Logo Container */}
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
            <img
              className="max-w-full max-h-full object-contain"
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
          <div className="font-bold opacity-60 text-gray-900 dark:text-gray-100">
            {lifecycle === 'over'
              ? 'Final'
              : lifecycle === 'live'
                ? 'Live'
                : formattedStartDate}
          </div>

          {/* Metrics Container */}
          <div className="flex flex-col space-y-1">
            {/* Kills Row */}
            <div className="flex items-center justify-between">
              {/* Team 1 Kills */}
              <div className={`flex items-center ${metricColor}`}>
                {team1Kills}
              </div>
              {/* Kills Icon */}
              <img src={placeholderTeam} alt="Kills" className="w-6 h-6" />
              {/* Team 2 Kills */}
              <div className={`flex items-center ${metricColor}`}>
                {team2Kills}
              </div>
            </div>

            {/* Gold Row */}
            <div className="flex items-center justify-between">
              {/* Team 1 Gold */}
              <div className={`flex items-center ${metricColor}`}>
                {team1Gold}
              </div>
              {/* Gold Icon */}
              <img src={placeholderTeam} alt="Gold" className="w-6 h-6" />
              {/* Team 2 Gold */}
              <div className={`flex items-center ${metricColor}`}>
                {team2Gold}
              </div>
            </div>

            {/* Towers Row */}
            <div className="flex items-center justify-between">
              {/* Team 1 Towers */}
              <div className={`flex items-center ${metricColor}`}>
                {team1Towers}
              </div>
              {/* Towers Icon */}
              <img src={placeholderTeam} alt="Towers" className="w-6 h-6" />
              {/* Team 2 Towers */}
              <div className={`flex items-center ${metricColor}`}>
                {team2Towers}
              </div>
            </div>
          </div>

          {/* Format */}
          <div className="font-bold opacity-60 text-gray-900 dark:text-gray-100">
            {bestOf}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center w-1/3">
          {/* Logo Container */}
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
            <img
              className="max-w-full max-h-full object-contain"
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

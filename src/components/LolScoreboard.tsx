import React from 'react';
import { Series } from 'src/schemas/series';
import { useTeamColors } from 'src/team-colors';
import AutoFitText from './AutoFitText';

import placeholderTeam from 'src/assets/images/placeholder-team.png';

interface LolScoreboardProps {
  series: Series;
}

const LolScoreboard: React.FC<LolScoreboardProps> = ({ series }) => {
  const { participants, title, lifecycle, start } = series;

  const getTeamColor = useTeamColors();

  // Extract team and participant data
  const team1 = participants[0]?.roster.team;
  const team2 = participants[1]?.roster.team;

  const team1Name = team1?.name || 'Team 1';
  const team2Name = team2?.name || 'Team 2';

  const team1Logo = team1?.images?.[0]?.url || placeholderTeam;
  const team2Logo = team2?.images?.[0]?.url || placeholderTeam;

  const score1 = participants[0]?.score ?? 0;
  const score2 = participants[1]?.score ?? 0;

  // Determine the winning side
  const winningSide = score1 > score2 ? 'left' : score2 > score1 ? 'right' : null;

  // Get team colors from the mapping, default to a color if not found
  const team1Color = getTeamColor(team1Name);
  const team2Color = getTeamColor(team2Name);

  // Winning color (use team color)
  const winningColor =
    winningSide === 'left' ? team1Color : winningSide === 'right' ? team2Color : '#A981FC';

  // Format string
  const bestOf = series.format?.bestOf ? `Best of ${series.format.bestOf}` : '';

  // Format the start date
  const startDate = new Date(start * 1000);
  const formattedStartDate = startDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  // Adjust score colors
  let score1Color = 'text-gray-700 dark:text-gray-300';
  let score2Color = 'text-gray-700 dark:text-gray-300';

  if (lifecycle === 'over') {
    if (winningSide === 'left') {
      score1Color = 'text-gray-900 dark:text-gray-100';
    } else if (winningSide === 'right') {
      score2Color = 'text-gray-900 dark:text-gray-100';
    }
  } else {
    // For live or upcoming matches, both scores are dark mode responsive
    score1Color = 'text-gray-900 dark:text-gray-100';
    score2Color = 'text-gray-900 dark:text-gray-100';
  }

  return (
    <div
      className="relative block w-full aspect-[2.5] text-center font-sans transform transition-transform duration-200 ease-in-out hover:scale-105"
      style={{ textDecoration: 'none' }}
    >
      {/* Background and border styles */}
      <div className="absolute inset-0 rounded-[5px] bg-gradient-to-b from-white to-gray-400 dark:from-gray-800 dark:to-gray-900 opacity-10 border border-solid border-gray-500" />

      {/* Winning gradient overlay */}
      {winningSide && (
        <div
          className="absolute inset-0 rounded-[5px] opacity-50"
          style={{
            backgroundImage:
              winningSide === 'left'
                ? `linear-gradient(to right, ${winningColor}, transparent)`
                : `linear-gradient(to left, ${winningColor}, transparent)`,
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
          {title}
        </div>
      </div>

      {/* Flex container for the content */}
      <div className="absolute inset-x-0 top-[12%] bottom-[12%] flex flex-row items-center justify-between px-4">
        {/* Left Column */}
        <div className="flex flex-col items-center w-1/3">
          {/* Logo Container with increased size and no background */}
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-4"> {/* Reduced mb from 6 to 4 */}
            <img
              className="max-w-full max-h-full object-contain" // Ensures the entire logo fits without cropping
              src={team1Logo}
              alt={team1Name}
            />
          </div>
          {/* Team Name without Seed */}
          <div className="flex items-center justify-center space-x-1 mt-2 w-full"> {/* Reduced mt from 4 to 2 */}
            <AutoFitText
              text={team1Name}
              maxFontSize={16} // Increased maxFontSize for better readability
              minFontSize={8}
              maxLines={2} // Allowing up to 2 lines
              className="text-gray-900 dark:text-gray-100 font-normal"
              style={{ width: '100%', textAlign: 'center' }}
            />
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col items-center w-1/3 justify-center space-y-6">
          {/* Time */}
          <div className="font-bold opacity-60 text-gray-900 dark:text-gray-100 mt-2">
            {lifecycle === 'over'
              ? 'Final'
              : lifecycle === 'upcoming'
                ? formattedStartDate
                : ''}
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
          <div className="font-bold opacity-60 text-gray-900 dark:text-gray-100">
            {bestOf}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center w-1/3">
          {/* Logo Container with increased size and no background */}
          <div className="w-[60px] h-[60px] flex items-center justify-center mb-4"> {/* Reduced mb from 6 to 4 */}
            <img
              className="max-w-full max-h-full object-contain" // Ensures the entire logo fits without cropping
              src={team2Logo}
              alt={team2Name}
            />
          </div>
          {/* Team Name without Seed */}
          <div className="flex items-center justify-center space-x-1 mt-2 w-full"> {/* Reduced mt from 4 to 2 */}
            <AutoFitText
              text={team2Name}
              maxFontSize={16} // Increased maxFontSize for better readability
              minFontSize={8}
              maxLines={2} // Allowing up to 2 lines
              className="text-gray-900 dark:text-gray-100 font-normal"
              style={{ width: '100%', textAlign: 'center' }}
            />
          </div>
        </div>
      </div>

      {/* Divider line adjusted */}
      <div className="absolute left-[5%] right-[5%] bottom-[5%] h-0.5 opacity-10 border-t border-solid border-gray-900 dark:border-gray-100" />
    </div>
  );
};

export default LolScoreboard;

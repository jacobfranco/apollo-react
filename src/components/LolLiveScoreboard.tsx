// src/components/LolLiveScoreboard.tsx

import React from 'react';
import { Series } from 'src/schemas/series';

interface LolLiveScoreboardProps {
  series: Series;
}

const LolLiveScoreboard: React.FC<LolLiveScoreboardProps> = ({ series }) => {
  const { participants, title, lifecycle } = series;

  // Extract team and participant data
  const team1 = participants[0]?.roster.team;
  const team2 = participants[1]?.roster.team;

  const team1Name = team1?.name || 'Team 1';
  const team2Name = team2?.name || 'Team 2';

  const team1Logo = team1?.images?.[0]?.url || '/placeholder-team1.png';
  const team2Logo = team2?.images?.[0]?.url || '/placeholder-team2.png';

  const team1Seed = participants[0]?.seed ?? '-';
  const team2Seed = participants[1]?.seed ?? '-';

  const score1 = participants[0]?.score ?? 0;
  const score2 = participants[1]?.score ?? 0;

  // Live stats
  const kills1 = participants[0]?.stats?.kills ?? 0;
  const kills2 = participants[1]?.stats?.kills ?? 0;

  const gold1 = participants[0]?.stats?.gold ?? 0;
  const gold2 = participants[1]?.stats?.gold ?? 0;

  const towers1 = participants[0]?.stats?.towers ?? 0;
  const towers2 = participants[1]?.stats?.towers ?? 0;

  // Game number and best of series
  const gameNumber = series?.format?.bestOf ? `Game ${score1 + score2 + 1}` : '';
  const bestOf = series?.format?.bestOf ? `Best of ${series.format.bestOf}` : '';

  return (
    <div
      className="relative block w-full h-[134px] text-center text-5xs text-white font-sans"
      style={{ textDecoration: 'none' }}
    >
      {/* Main container for the scoreboard */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Background and border styles */}
        <div className="absolute inset-0 rounded-[5px] bg-gradient-to-b from-white to-gray-400 opacity-10 border border-solid border-gray-500" />

        {/* Live indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 rounded-b w-[125px] h-[18px] flex items-center justify-center">
          <div className="text-xs font-medium">LIVE</div>
        </div>

        {/* Title */}
        <div className="absolute top-[20px] left-1/2 transform -translate-x-1/2 text-xs font-medium">
          {title}
        </div>

        {/* Team 1 logo */}
        <img
          className="absolute top-1/2 left-[29px] transform -translate-y-1/2 w-11 h-11 rounded-[5px] object-cover"
          src={team1Logo}
          alt={team1Name}
        />

        {/* Team 2 logo */}
        <img
          className="absolute top-1/2 right-[28px] transform -translate-y-1/2 w-11 h-11 rounded-[5px] object-cover"
          src={team2Logo}
          alt={team2Name}
        />

        {/* Team 1 name and seed */}
        <div className="absolute bottom-[20px] left-[5.98%] text-7xs text-gray-500 font-medium">
          <span>{team1Seed}</span>
          <span className="text-3xs text-white whitespace-pre-wrap">{` ${team1Name}`}</span>
        </div>

        {/* Team 2 name and seed */}
        <div className="absolute bottom-[20px] right-[5.98%] text-7xs text-gray-500 font-medium">
          <span className="whitespace-pre-wrap">{`${team2Seed} `}</span>
          <span className="text-3xs text-white">{team2Name}</span>
        </div>

        {/* Live stats */}
        {/* Kills */}
        <div className="absolute top-1/2 left-[37.58%] transform -translate-y-[60%] text-5xl font-medium">
          {kills1}
        </div>
        <img
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-[15px] h-[15px] object-cover"
          src="/icons8sword502@2x.png"
          alt="Kills Icon"
        />
        <div className="absolute top-1/2 left-[54.14%] transform -translate-y-[60%] text-5xl font-medium">
          {kills2}
        </div>

        {/* Gold */}
        <div className="absolute top-1/2 left-[37.58%] transform -translate-y-[30%] text-3xs font-medium opacity-50">
          {gold1}k
        </div>
        <img
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[30%] w-2.5 h-2.5 object-cover"
          src="/icons8coins503@2x.png"
          alt="Gold Icon"
        />
        <div className="absolute top-1/2 left-[54.14%] transform -translate-y-[30%] text-3xs font-medium">
          {gold2}k
        </div>

        {/* Towers */}
        <div className="absolute top-1/2 left-[40.64%] transform -translate-y-[0%] text-3xs font-medium opacity-50">
          {towers1}
        </div>
        <img
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[0%] w-2.5 h-2.5 object-cover"
          src="/icons8tower502@2x.png"
          alt="Towers Icon"
        />
        <div className="absolute top-1/2 left-[57.21%] transform -translate-y-[0%] text-3xs font-medium">
          {towers2}
        </div>

        {/* Game number and best of series */}
        <div className="absolute bottom-[20px] left-[6.13%] text-xs font-medium opacity-80">
          {gameNumber}
        </div>
        <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-60">
          {bestOf}
        </div>
        <div className="absolute bottom-[20px] right-[6.13%] text-xs font-medium opacity-80 text-right">
          Tied {score1}-{score2}
        </div>

        {/* Divider */}
        <div className="absolute left-[17.5px] right-[18.5px] bottom-[17px] h-0.5 opacity-10 border-t border-solid border-white" />
      </div>
    </div>
  );
};

export default LolLiveScoreboard;

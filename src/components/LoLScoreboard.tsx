import React from 'react';
import { Link } from 'react-router-dom';
import { ScoreboardProps } from './Scoreboard';
import ScoreboardOverlay from './ScoreboardOverlay';
import { type Team } from 'src/schemas'

// Interface for LoLScoreboard properties
interface LoLScoreboardProps extends ScoreboardProps {
  team1: Team;
  team2: Team;
  seriesInfo: string;
  gameNumber: string;
  leadingTeam: string;
  leadingScore: string;
}

// Main component for displaying the League of Legends scoreboard
const LoLScoreboard: React.FC<LoLScoreboardProps> = ({
  gameId,
  team1,
  team2,
  seriesInfo,
  gameNumber,
  leadingTeam,
  leadingScore,
}) => {
  // Winning side and color configuration
  const winningSide = 'right'; // Change to 'left' or 'right' to test
  const winningColor = '#A981FC'; // Change this color to test

  return (
    // Link component for navigating to game details
    <Link
      to={`/games/lol/scores/${gameId}`}
      className="relative block w-full h-[134px] text-center text-5xs text-white font-urw-din"
      style={{ textDecoration: 'none' }}
    >
      {/* Main container for the scoreboard */}
      <div className="absolute top-[0px] left-[0px] w-full h-[134px]">
        {/* Background and border styles */}
        <div className="absolute h-[calc(100%_-_1px)] w-full top-[1px] right-[0px] bottom-[0px] left-[0px] rounded-5px [background:linear-gradient(180deg,_#fff,_#808080)] box-border opacity-[0.1] border-[1px] border-solid border-gray-500" />
        <ScoreboardOverlay />
        
        {/* Team 1 kills display */}
        <div className="absolute top-[calc(50%_-_27.5px)] left-[37.58%] text-5xl tracking-[0.6px] font-medium [text-shadow:0px_0px_5px_rgba(0,_0,_0,_0.1)] [-webkit-text-stroke:1px_rgba(0,_0,_0,_0)] opacity-[0.5]">
          {team1.kills}
        </div>
        
        {/* Team 1 name and record display */}
        <div className="absolute top-[calc(50%_+_8.5px)] left-[5.98%] capitalize font-medium [text-shadow:0px_0px_5px_rgba(0,_0,_0,_0.1)] [-webkit-text-stroke:1px_rgba(0,_0,_0,_0)] text-7xs text-gray-500">
          <span>{team1.record}</span>
          <span className="text-3xs text-white whitespace-pre-wrap">
            {` ${team1.name}`}
          </span>
        </div>

        {/* Team 2 name and record display */}
        <div className="absolute top-[calc(50%_+_7.5px)] left-[78.68%] font-medium [text-shadow:0px_0px_5px_rgba(0,_0,_0,_0.1)] [-webkit-text-stroke:1px_rgba(0,_0,_0,_0)] text-7xs text-gray-500">
          <span className="whitespace-pre-wrap">{`${team2.record} `}</span>
          <span className="text-3xs text-white">{team2.name}</span>
        </div>

        {/* Team 1 logo display */}
        <img
          className="absolute top-[calc(50%_-_43px)] left-[29px] rounded-5px w-11 h-11 object-cover"
          alt={team1.name}
          src={team1.logo}
        />

        {/* Team 2 logo display */}
        <img
          className="absolute top-[calc(50%_-_44px)] right-[28px] rounded-5px w-11 h-11 object-cover"
          alt={team2.name}
          src={team2.logo}
        />

        {/* Divider line */}
        <div className="absolute w-[calc(100%_-_36px)] right-[18.5px] bottom-[9px] left-[17.5px] box-border h-0.5 opacity-[0.1] border-t-[1px] border-solid border-white" />

        {/* Series info banner */}
        <div className="absolute top-[0px] left-[calc(50%_-_62px)] rounded-t-none rounded-b bg-primary-500 w-[125px] h-[18px]" />
        <div className="absolute w-[33.74%] top-[calc(50%_-_62px)] left-[33.59%] tracking-[0.2px] font-medium inline-block h-2.5">
          {seriesInfo}
        </div>

        {/* Leading team and score display */}
        <div className="absolute w-[24.85%] top-[calc(50%_+_44px)] left-[69.94%] tracking-[0.2px] text-right inline-block h-2.5 opacity-[0.8]">
          {leadingTeam} leads {leadingScore}
        </div>

        {/* Final status display */}
        <div className="absolute w-[20.55%] top-[calc(50%_-_41px)] left-[40.03%] tracking-[0.2px] font-medium inline-block h-2.5 opacity-[0.6]">
          Final
        </div>

        {/* Team 1 seed display */}
        <div className="absolute w-[20.55%] top-[calc(50%_+_21px)] left-[5.21%] tracking-[0.2px] inline-block h-2.5 opacity-[0.6]">
          {team1.seed}
        </div>

        {/* Team 2 seed display */}
        <div className="absolute w-[20.55%] top-[calc(50%_+_21px)] left-[74.54%] tracking-[0.2px] inline-block h-2.5 opacity-[0.6]">
          {team2.seed}
        </div>

        {/* Center sword icon */}
        <img
          className="absolute top-[calc(50%_-_25px)] left-[calc(50%_-_7px)] w-[15px] h-[15px] object-cover"
          alt="sword icon"
          src="/icons8sword502@2x.png"
        />

        {/* Team 2 kills display */}
        <div className="absolute top-[calc(50%_-_27.5px)] left-[54.14%] text-5xl tracking-[0.6px] font-medium [text-shadow:0px_0px_5px_rgba(0,_0,_0,_0.1)] [-webkit-text-stroke:1px_rgba(0,_0,_0,_0)]">
          {team2.kills}
        </div>

        {/* Team 1 gold display */}
        <div className="absolute top-[calc(50%_+_2.5px)] left-[37.58%] text-3xs tracking-[0.25px] [text-shadow:0px_0px_5px_rgba(0,_0,_0,_0.1)] [-webkit-text-stroke:1px_rgba(0,_0,_0,_0)] opacity-[0.5]">
          {team1.gold}
        </div>

        {/* Center coin icon */}
        <img
          className="absolute top-[calc(50%_+_3px)] left-[calc(50%_-_5px)] w-2.5 h-2.5 object-cover"
          alt="coin icon"
          src="/icons8coins503@2x.png"
        />

        {/* Team 2 gold display */}
        <div className="absolute top-[calc(50%_+_2.5px)] left-[54.14%] text-3xs tracking-[0.25px] [text-shadow:0px_0px_5px_rgba(0,_0,_0,_0.1)] [-webkit-text-stroke:1px_rgba(0,_0,_0,_0)]">
          {team2.gold}
        </div>

        {/* Team 1 towers display */}
        <div className="absolute top-[calc(50%_+_16.5px)] left-[40.64%] text-3xs tracking-[0.25px] [text-shadow:0px_0px_5px_rgba(0,_0,_0,_0.1)] [-webkit-text-stroke:1px_rgba(0,_0,_0,_0)] opacity-[0.5]">
          {team1.towers}
        </div>

        {/* Center tower icon */}
        <img
          className="absolute top-[calc(50%_+_17px)] left-[calc(50%_-_5px)] w-2.5 h-2.5 object-cover"
          alt="tower icon"
          src="/icons8tower502@2x.png"
        />

        {/* Team 2 towers display */}
        <div className="absolute top-[calc(50%_+_16.5px)] left-[57.21%] text-3xs tracking-[0.25px] [text-shadow:0px_0px_5px_rgba(0,_0,_0,_0.1)] [-webkit-text-stroke:1px_rgba(0,_0,_0,_0)]">
          {team2.towers}
        </div>

        {/* Game number display */}
        <div className="absolute w-[24.85%] top-[calc(50%_+_44px)] left-[6.13%] tracking-[0.2px] text-left inline-block h-2.5 opacity-[0.8]">
          {gameNumber}
        </div>

        {/* Best of 3 display */}
        <div className="absolute w-[24.85%] top-[calc(50%_+_44px)] left-[38.04%] tracking-[0.2px] inline-block h-2.5 opacity-[0.6]">
          Best of 3
        </div>
      </div>

      
    </Link>
  );
};

export default LoLScoreboard;

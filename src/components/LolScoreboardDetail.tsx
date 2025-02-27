// src/components/LolScoreboardDetail.tsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { selectSeriesById, selectMatchById } from "src/selectors";
import { fetchSeriesById } from "src/actions/series";
import { fetchMatch } from "src/actions/matches";
import TeamsHeader from "./TeamsHeader";
import PlayerRow from "./PlayerRow";
import { Tabs } from "src/components";
import useLiveMatchStream from "src/api/hooks/useLiveMatchStream";
import { Participant, Player } from "src/schemas";
import {
  connectSeriesUpdatesStream,
  connectMatchUpdatesStream,
} from "src/actions/streaming";
import { Match } from "src/schemas/match";
import { getCoverageFact } from "src/utils/esports";

interface LolScoreboardDetailProps {
  seriesId: number;
  esportName: string;
}

const LolScoreboardDetail: React.FC<LolScoreboardDetailProps> = ({
  seriesId,
  esportName,
}) => {
  const dispatch = useAppDispatch();

  // Fetch series data
  const series = useAppSelector((state) => selectSeriesById(state, seriesId));

  // Fetch the series if it's not available
  useEffect(() => {
    if (!series) {
      dispatch(fetchSeriesById(seriesId, esportName));
    }
  }, [dispatch, series, seriesId, esportName]);

  // State to track selected tab (index of availableMatches)
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [initialTabSet, setInitialTabSet] = useState(false);

  // Fetch match data for all matches in the series
  const matches = useAppSelector((state) =>
    series && series.matchIds
      ? series.matchIds.map((matchId) => selectMatchById(state, matchId))
      : []
  );

  // Ref to track fetched match IDs
  const fetchedMatchIds = useRef(new Set<number>());

  // Dispatch action to fetch match data if not available and series is not upcoming
  useEffect(() => {
    if (
      series &&
      series.lifecycle !== "upcoming" &&
      series.matchIds &&
      series.matchIds.length > 0
    ) {
      const missingMatchIds = series.matchIds.filter(
        (matchId) => !fetchedMatchIds.current.has(matchId)
      );

      missingMatchIds.forEach((matchId) => {
        dispatch(fetchMatch(matchId));
        fetchedMatchIds.current.add(matchId);
      });
    }
  }, [dispatch, series]);

  // Filter out matches where match.lifecycle === "deleted"
  const availableMatches = useMemo(() => {
    if (!series) return [];
    if (series.lifecycle === "upcoming") {
      return [{ id: "preview", name: "Preview" }];
    } else {
      return matches.filter((match) => match && match.lifecycle !== "deleted");
    }
  }, [series, matches]);

  const getCurrentMatchIndex = useMemo(() => {
    if (!series || series.lifecycle !== "live" || !availableMatches.length) {
      return 0;
    }

    let totalScore1 = 0;
    let totalScore2 = 0;

    for (let i = 0; i < availableMatches.length; i++) {
      totalScore1 += series.participants?.[0]?.score || 0;
      totalScore2 += series.participants?.[1]?.score || 0;

      if (totalScore1 > totalScore2) {
        return i;
      }
    }

    return availableMatches.length - 1;
  }, [series, availableMatches]);

  // Update the useEffect hook to set the initial tab based on the current match index
  useEffect(() => {
    if (!initialTabSet && availableMatches.length > 0) {
      if (series?.lifecycle === "live") {
        setSelectedTab(getCurrentMatchIndex);
      }
      setInitialTabSet(true);
    }
  }, [series, availableMatches, getCurrentMatchIndex, initialTabSet]);

  // Ensure selectedTab is within the bounds of availableMatches
  useEffect(() => {
    if (selectedTab >= availableMatches.length) {
      setSelectedTab(0);
    }
  }, [selectedTab, availableMatches.length]);

  if (!series) {
    return <div>Loading series data...</div>;
  }

  useEffect(() => {
    const disconnectSeriesUpdates = dispatch(connectSeriesUpdatesStream());
    const disconnectMatchUpdates = dispatch(connectMatchUpdatesStream());

    return () => {
      if (disconnectSeriesUpdates) {
        disconnectSeriesUpdates();
      }
      if (disconnectMatchUpdates) {
        disconnectMatchUpdates();
      }
    };
  }, [dispatch]);

  // Selected match based on selectedTab
  const selectedMatch =
    series.lifecycle === "upcoming" ? null : availableMatches[selectedTab];

  // Use live match stream if the match is live
  const matchId =
    selectedMatch && typeof selectedMatch.id === "number"
      ? selectedMatch.id
      : null;
  useLiveMatchStream(matchId);

  // Fetch live match data
  const liveMatch = useAppSelector((state) =>
    matchId ? selectMatchById(state, matchId) : undefined
  );

  const coverageFact = getCoverageFact(liveMatch);

  // Merge participants
  const mergedParticipants: Participant[] = useMemo(() => {
    if (
      coverageFact === "available" &&
      liveMatch &&
      liveMatch.participants &&
      liveMatch.participants.length >= 2
    ) {
      return liveMatch.participants;
    } else if (series.participants && series.participants.length >= 2) {
      return series.participants;
    } else {
      return [];
    }
  }, [liveMatch, series.participants, coverageFact]);

  // Participants from merged data
  let team1, team2, team1Players, team2Players;

  if (mergedParticipants.length >= 2) {
    team1 = mergedParticipants[0];
    team2 = mergedParticipants[1];

    // Use players from Participant.roster.players
    team1Players = team1?.roster?.players ? [...team1.roster.players] : [];
    team2Players = team2?.roster?.players ? [...team2.roster.players] : [];
  } else {
    // Handle the case where participants are not available
    return <div>Participants data is not available.</div>;
  }

  // Sort players by position
  type Position = "top" | "jungle" | "mid" | "bot" | "support";

  const positionOrder: Position[] = ["top", "jungle", "mid", "bot", "support"];

  function isPosition(role: any): role is Position {
    return positionOrder.includes(role);
  }

  function assignPlayersToPositions(players: Player[]): (Player | null)[] {
    const positions: Partial<Record<Position, Player>> = {};
    const unassignedPlayers: Player[] = [];

    players.forEach((player: Player) => {
      const role = player.role;
      if (isPosition(role) && !positions[role]) {
        positions[role] = player;
      } else {
        unassignedPlayers.push(player);
      }
    });

    // Fill empty positions with unassigned players
    positionOrder.forEach((role) => {
      if (!positions[role] && unassignedPlayers.length > 0) {
        positions[role] = unassignedPlayers.shift() || undefined;
      }
    });

    // Return the players in position order
    return positionOrder.map((role) => positions[role] || null);
  }

  const team1PlayersInOrder = assignPlayersToPositions(team1Players);
  const team2PlayersInOrder = assignPlayersToPositions(team2Players);

  // Retrieve Series Scores
  const team1SeriesScore = series.participants?.[0]?.score || 0;
  const team2SeriesScore = series.participants?.[1]?.score || 0;

  return (
    <div className="relative text-white">
      {/* Match Tabs */}
      {availableMatches.length > 0 && (
        <div className="flex justify-center items-center px-4">
          <div className="w-full max-w-md">
            <Tabs
              items={availableMatches.map((match, index) => ({
                text:
                  series.lifecycle === "upcoming"
                    ? "Preview"
                    : (index + 1).toString(),
                action: () => setSelectedTab(index),
                name: index.toString(),
              }))}
              activeItem={selectedTab.toString()}
            />
          </div>
        </div>
      )}

      {/* Teams Header with Series Scores */}
      <TeamsHeader
        match={
          selectedMatch && "lifecycle" in selectedMatch
            ? (selectedMatch as Match)
            : undefined
        }
        series={series}
        bestOf={series?.format?.bestOf || 1}
        team1SeriesScore={team1SeriesScore}
        team2SeriesScore={team2SeriesScore}
      />

      {/* Players */}
      {team1PlayersInOrder && team2PlayersInOrder && (
        <div className="grid grid-cols-2">
          {/* Team 1 Players */}
          <div className="flex flex-col space-y-1">
            {team1PlayersInOrder.map((player) => (
              <PlayerRow key={player?.id} player={player} team={"left"} />
            ))}
          </div>

          {/* Team 2 Players */}
          <div className="flex flex-col space-y-1">
            {team2PlayersInOrder.map((player) => (
              <PlayerRow key={player?.id} player={player} team={"right"} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LolScoreboardDetail;

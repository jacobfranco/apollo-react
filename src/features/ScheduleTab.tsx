import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import LolScoreboard from "src/components/LolScoreboard";
import LolLiveScoreboard from "src/components/LolLiveScoreboard";
import esportsConfig from "src/esports-config";
import {
  selectSeriesByWeek,
  selectSeriesLoading,
  selectSeriesError,
} from "src/selectors";
import WeekPicker from "src/components/WeekPicker";
import { getAllMondays, formatDate } from "src/utils/dates";
import { openModal, closeModal } from "src/actions/modals";
import { HStack, Spinner } from "src/components";
import { Button } from "src/components/Button";
import { Series, Participant } from "src/schemas";
import { fetchSeries } from "src/actions/series";
import { teamData } from "src/teams";

const ScheduleTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();
  const game = esportsConfig.find((g) => g.path === esportName);

  const seriesList: Series[] = useAppSelector((state) =>
    selectSeriesByWeek(state).toArray()
  );
  const loading = useAppSelector(selectSeriesLoading);
  const error = useAppSelector(selectSeriesError);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const allMondays = getAllMondays(year);
    const firstMonday = allMondays[0];

    if (now.getFullYear() === year) {
      const day = now.getDay();
      if (day === 1) {
        const alignedDate = new Date(now);
        alignedDate.setHours(0, 0, 0, 0);
        return alignedDate;
      } else {
        const diff = day === 0 ? -6 : 1 - day;
        const alignedDate = new Date(now);
        alignedDate.setDate(now.getDate() + diff);
        alignedDate.setHours(0, 0, 0, 0);
        if (alignedDate.getFullYear() === year) {
          return alignedDate;
        }
      }
    }
    return firstMonday;
  });

  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  useEffect(() => {
    const timestamp = Math.floor(selectedDate.getTime() / 1000);
    if (game?.hasApiSupport) {
      dispatch(fetchSeries({ timestamp, gamePath: game.path }));
    }
  }, [dispatch, selectedDate, game]);

  if (!game) {
    return (
      <div className="text-center text-danger-500">Invalid eSport name</div>
    );
  }

  if (error) {
    return <div className="text-center text-danger-500">Error: {error}</div>;
  }

  const handleOpenFilterModal = () => {
    dispatch(
      openModal("LOL_REGION", {
        onApplyFilter: (leagues: string[]) => {
          setSelectedLeagues(leagues);
          dispatch(closeModal());
        },
      })
    );
  };

  // Filter series based on selected leagues
  const filteredSeries = seriesList.filter((seriesItem: Series) => {
    if (selectedLeagues.length === 0) return true;

    return seriesItem.participants.some((participant: Participant) => {
      const team = participant.roster?.team;
      if (!team) return false;

      const teamName = team.name;
      const teamInfo = teamData[teamName];
      const teamLeague = teamInfo?.league ?? "Unknown";

      const matchesLeague = teamLeague && selectedLeagues.includes(teamLeague);

      return matchesLeague;
    });
  });

  const groupedSeries = filteredSeries.reduce((groups, seriesItem) => {
    const date = new Date(seriesItem.start * 1000);
    const dayKey = date.toDateString();
    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(seriesItem);
    return groups;
  }, {} as { [key: string]: Series[] });

  // Sort the keys (dates) in chronological order
  const sortedDays = Object.keys(groupedSeries).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // Sort series within each day by start time
  sortedDays.forEach((day) => {
    groupedSeries[day].sort((a, b) => a.start - b.start);
  });

  const renderScoresContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (filteredSeries.length === 0) {
      return <div className="text-center">No series available.</div>;
    }

    switch (game.path) {
      case "lol": {
        return (
          <div className="space-y-8">
            {sortedDays.map((day) => (
              <div key={day}>
                <h2 className="text-xl font-semibold mb-4">
                  {formatDate(day)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-3">
                  {groupedSeries[day].map((seriesItem) => {
                    const { id, lifecycle } = seriesItem;
                    const ScoreboardComponent =
                      lifecycle === "live" ? LolLiveScoreboard : LolScoreboard;

                    return (
                      <Link
                        key={id}
                        to={`/esports/${esportName}/series/${id}`}
                        className="block p-0 m-0 transform transition-transform duration-200 ease-in-out hover:scale-101"
                        style={{ width: "100%", textDecoration: "none" }}
                      >
                        <ScoreboardComponent seriesId={id} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      }
      default:
        return <div>Unsupported game type for scores content</div>;
    }
  };

  return (
    <div className="space-y-4">
      <HStack
        justifyContent="center"
        alignItems="center"
        space={4}
        className="pt-4"
      >
        <WeekPicker selectedDate={selectedDate} onChange={setSelectedDate} />
        <Button onClick={handleOpenFilterModal}>Filter Leagues</Button>
      </HStack>
      {renderScoresContent()}
    </div>
  );
};

export default ScheduleTab;

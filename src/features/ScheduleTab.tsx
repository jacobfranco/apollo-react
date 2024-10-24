import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'src/hooks';
import LolScoreboard from 'src/components/LolScoreboard';
import LolLiveScoreboard from 'src/components/LolLiveScoreboard';
import ValorantScoreboard from 'src/components/ValorantScoreboard';
import esportsConfig from 'src/esports-config';
import {
  selectAllSeries,
  selectSeriesLoading,
  selectSeriesError,
} from 'src/selectors';
import WeekPicker from 'src/components/WeekPicker';
import { getAllMondays, formatDate } from 'src/utils/dates';
import { openModal, closeModal } from 'src/actions/modals';
import { HStack } from 'src/components';
import { Button } from 'src/components/Button';
import { Series } from 'src/schemas/series';
import { fetchSeries } from 'src/actions/series';
import { connectSeriesUpdatesStream, connectMatchUpdatesStream } from 'src/actions/streaming';

const ScheduleTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();
  const game = esportsConfig.find((g) => g.path === esportName);

  const seriesList: Series[] = useAppSelector((state) => selectAllSeries(state).toArray());
  const loading = useAppSelector(selectSeriesLoading);
  const error = useAppSelector(selectSeriesError);

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

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    const year = 2024;
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

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  useEffect(() => {
    const timestamp = Math.floor(selectedDate.getTime() / 1000);
    if (game) {
      dispatch(fetchSeries({ timestamp, gamePath: game.path }));
    }
  }, [dispatch, selectedDate, game]);

  if (!game) {
    return <div className="text-center text-red-500">Invalid eSport name</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const handleOpenFilterModal = () => {
    dispatch(
      openModal('REGION_FILTER', {
        onApplyFilter: (regions: string[]) => {
          setSelectedRegions(regions);
          dispatch(closeModal());
        },
      }),
    );
  };

  const filteredSeries = seriesList.filter(
    (seriesItem: Series) =>
      seriesItem.lifecycle !== 'deleted' &&
      (selectedRegions.length === 0 ||
        seriesItem.participants.some((participant) =>
          selectedRegions.includes(participant.roster.team?.region?.abbreviation || ''),
        )),
  );

  const groupedSeries = filteredSeries.reduce((groups, seriesItem) => {
    const date = new Date(seriesItem.start * 1000);
    const dayKey = date.toDateString();
    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(seriesItem);
    return groups;
  }, {} as { [key: string]: Series[] });

  const renderScoresContent = () => {
    if (loading) {
      return <div className="text-center">Loading...</div>;
    }

    if (filteredSeries.length === 0) {
      return <div className="text-center">No series available.</div>;
    }

    switch (game.path) {
      case 'lol': {
        return (
          <div className="space-y-8">
            {Object.entries(groupedSeries).map(([day, seriesForDay]) => (
              <div key={day}>
                <h2 className="text-xl font-semibold mb-4">{formatDate(day)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-3">
                  {seriesForDay.map((seriesItem) => {
                    const { id, lifecycle } = seriesItem;
                    const ScoreboardComponent =
                      lifecycle === 'live' ? LolLiveScoreboard : LolScoreboard;

                    return (
                      <Link
                        key={id}
                        to={`/esports/${esportName}/series/${id}`}
                        className="block p-0 m-0 transform transition-transform duration-200 ease-in-out hover:scale-101"
                        style={{ width: '100%', textDecoration: 'none' }}
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
      case 'valorant': {
        return (
          <div className="space-y-8">
            {Object.entries(groupedSeries).map(([day, seriesForDay]) => (
              <div key={day}>
                <h2 className="text-xl font-semibold mb-4">{day}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
                  {seriesForDay.map((seriesItem) => (
                    <Link
                      key={seriesItem.id}
                      to={`/esports/${esportName}/series/${seriesItem.id}`}
                      className="block p-0 m-0 transform transition-transform duration-200 ease-in-out hover:scale-101"
                      style={{ width: '100%', textDecoration: 'none' }}
                    >
                      {/* <ValorantScoreboard seriesId={seriesItem.id} /> */}
                    </Link>
                  ))}
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
    <div className="space-y-8 mt-4">
      <HStack justifyContent="center" alignItems="center" space={4} className="mb-4">
        <WeekPicker selectedDate={selectedDate} onChange={setSelectedDate} />
        <Button onClick={handleOpenFilterModal}>Filter Regions</Button>
      </HStack>
      {renderScoresContent()}
    </div>
  );
};

export default ScheduleTab;

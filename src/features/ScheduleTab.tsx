import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'src/hooks';
import LolScoreboard from 'src/components/LolScoreboard';
import LolLiveScoreboard from 'src/components/LolLiveScoreboard';
import ValorantScoreboard from 'src/components/ValorantScoreboard';
import esportsConfig from 'src/esports-config';
import { selectLolSeries, selectLolLoading, selectLolError } from 'src/selectors';
import WeekPicker from 'src/components/WeekPicker';
import { getAllMondays } from 'src/utils/weeks';
import { openModal, closeModal } from 'src/actions/modals';
import { HStack } from 'src/components';
import { Button } from 'src/components/Button';
import { Series } from 'src/schemas/series';
import { fetchLolSchedule } from 'src/actions/lol-schedule';

const ScheduleTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName } = useParams<{ esportName: string }>();
  const game = esportsConfig.find((g) => g.path === esportName);

  const series: Series[] = useAppSelector((state) => selectLolSeries(state).toArray());
  const loading = useAppSelector(selectLolLoading);
  const error = useAppSelector(selectLolError);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Initialize to the current week's Monday with time set to midnight
    const now = new Date();
    const year = 2024;
    const allMondays = getAllMondays(year);
    const firstMonday = allMondays[0];

    if (now.getFullYear() === year) {
      const day = now.getDay();
      if (day === 1) { // If today is Monday
        const alignedDate = new Date(now);
        alignedDate.setHours(0, 0, 0, 0);
        return alignedDate;
      } else {
        const diff = day === 0 ? -6 : 1 - day;
        const alignedDate = new Date(now);
        alignedDate.setDate(now.getDate() + diff);
        alignedDate.setHours(0, 0, 0, 0);
        // Ensure the alignedDate is within 2024
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
    if (game?.path === 'lol') {
      dispatch(fetchLolSchedule({ timestamp }));
    }
    // Implement similar dispatches for other games when needed
  }, [dispatch, selectedDate, game]);

  if (!game) {
    return <div className="text-center text-red-500">Invalid eSport name</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const handleOpenFilterModal = () => {
    dispatch(openModal('REGION_FILTER', {
      onApplyFilter: (regions: string[]) => {
        setSelectedRegions(regions);
        dispatch(closeModal());
      }
    }));
  };

  const filteredSeries = series.filter((seriesItem: Series) =>
    selectedRegions.length === 0 ||
    seriesItem.participants.some((participant) =>
      selectedRegions.includes(participant.roster.team.region?.abbreviation || '')
    )
  );

  const renderScoresContent = () => {
    switch (game.path) {
      case 'lol': {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-3">
            {series.map((seriesItem) => {
              const { id, lifecycle } = seriesItem;

              let ScoreboardComponent = LolScoreboard;
              if (lifecycle === 'live') {
                ScoreboardComponent = LolLiveScoreboard;
              }

              return (
                <Link
                  key={id}
                  to={`/esports/${esportName}/series/${id}`}
                  className="block p-0 m-0 transform transition-transform duration-200 ease-in-out hover:scale-101"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <ScoreboardComponent series={seriesItem} />
                </Link>
              );
            })}
          </div>
        );
      }
      case 'valorant': {
        // Handle Valorant series when available
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
            {/* Map over Valorant series */}
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
        <Button onClick={handleOpenFilterModal}>
          Filter Regions
        </Button>
      </HStack>
      {renderScoresContent()}
    </div>
  );
};

export default ScheduleTab;

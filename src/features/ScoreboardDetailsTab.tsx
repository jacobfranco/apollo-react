import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from 'src/hooks';
import { selectSeriesById } from 'src/selectors';
import LolScoreboardDetail from 'src/components/LolScoreboardDetail';

const ScoreboardDetailsTab: React.FC = () => {
  const { esportName, seriesId } = useParams<{ esportName: string; seriesId: string }>();
  const seriesIdNumber = Number(seriesId);

  // Use the new selector to fetch the series data
  const seriesData = useAppSelector((state) => selectSeriesById(state, seriesIdNumber));

  if (!seriesData) {
    return <div>Series not found.</div>;
  }

  switch (esportName) {
    case 'lol':
      // Pass seriesId to the component
      return <LolScoreboardDetail seriesId={seriesIdNumber} />;
    // Add cases for other games
    default:
      return <div>Unsupported game type.</div>;
  }
};

export default ScoreboardDetailsTab;

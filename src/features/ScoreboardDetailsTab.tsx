// components/ScoreboardDetailsTab.tsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { selectSeriesById } from "src/selectors";
import { fetchSeriesById } from "src/actions/series";
import LolScoreboardDetail from "src/components/LolScoreboardDetail";
import { Column } from "src/components/Column";
import esportsConfig from "src/esports-config";
import { formatScoreboardTitle } from "src/utils/esports";

const ScoreboardDetailsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { esportName, seriesId } = useParams<{
    esportName: string;
    seriesId: string;
  }>();
  const seriesIdNumber = Number(seriesId);

  // Fetch the series data using the selector
  const seriesData = useAppSelector((state) =>
    selectSeriesById(state, seriesIdNumber)
  );

  // Fetch the series if it's not available
  useEffect(() => {
    if (!seriesData) {
      dispatch(fetchSeriesById(seriesIdNumber, esportName));
    }
  }, [dispatch, seriesData, seriesIdNumber, esportName]);

  let formattedTitle = "";
  if (seriesData) {
    formattedTitle = formatScoreboardTitle(seriesData);
  }

  // Find the game configuration based on esportName
  const game = esportsConfig.find((g) => g.path === esportName);

  if (!game) {
    return (
      <Column label="Error" transparent={false} withHeader={true}>
        <div className="text-center text-red-500">Invalid esport name.</div>
      </Column>
    );
  }

  // Handle loading state
  if (!seriesData) {
    return (
      <Column label="Loading..." transparent={false} withHeader={true}>
        <div className="text-center">Loading series data...</div>
      </Column>
    );
  }

  return (
    <Column label={formattedTitle} transparent={false} withHeader={true}>
      <div className="space-y-6">
        <div className="scoreboard-content">
          {(() => {
            switch (esportName) {
              case "lol":
                return (
                  <LolScoreboardDetail
                    seriesId={seriesIdNumber}
                    esportName={esportName}
                  />
                );
              default:
                return (
                  <div className="text-center text-yellow-500">
                    Unsupported game type.
                  </div>
                );
            }
          })()}
        </div>
      </div>
    </Column>
  );
};

export default ScoreboardDetailsTab;

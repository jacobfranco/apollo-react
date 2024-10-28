import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "src/hooks";
import { selectSeriesById } from "src/selectors";
import LolScoreboardDetail from "src/components/LolScoreboardDetail";
import { Column } from "src/components/Column"; // Import the Column component
import esportsConfig from "src/esports-config"; // Import esportsConfig to get game details
import { formatScoreboardTitle } from "src/utils/scoreboards";

const ScoreboardDetailsTab: React.FC = () => {
  const { esportName, seriesId } = useParams<{
    esportName: string;
    seriesId: string;
  }>();
  const seriesIdNumber = Number(seriesId);

  // Fetch the series data using the selector
  const seriesData = useAppSelector((state) =>
    selectSeriesById(state, seriesIdNumber)
  );

  let formattedTitle = "";
  if (seriesData) {
    formattedTitle = formatScoreboardTitle(seriesData);
  }

  if (!seriesData) {
    return (
      <Column
        label="Error" // You can customize the label as needed
        transparent={false}
        withHeader={true}
      >
        <div className="text-center text-red-500">Series not found.</div>
      </Column>
    );
  }

  // Find the game configuration based on esportName
  const game = esportsConfig.find((g) => g.path === esportName);

  if (!game) {
    return (
      <Column
        label="Error" // You can customize the label as needed
        transparent={false}
        withHeader={true}
      >
        <div className="text-center text-red-500">Invalid esport name.</div>
      </Column>
    );
  }

  return (
    <Column label={formattedTitle} transparent={false} withHeader={true}>
      <div className="space-y-6">
        {/* You can add additional consistent formatting here if needed */}
        <div className="scoreboard-content">
          {(() => {
            switch (esportName) {
              case "lol":
                // Render the League of Legends scoreboard detail component
                return <LolScoreboardDetail seriesId={seriesIdNumber} />;
              // Add cases for other games here
              // case 'csgo':
              //   return <CsgoScoreboardDetail seriesId={seriesIdNumber} />;
              // case 'dota2':
              //   return <Dota2ScoreboardDetail seriesId={seriesIdNumber} />;
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

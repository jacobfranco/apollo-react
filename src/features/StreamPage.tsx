import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { fetchSeriesById } from "src/actions/series";
import {
  selectSeriesById,
  selectSeriesLoading,
  selectSeriesError,
} from "src/selectors";
import LiveStreamEmbed from "src/components/LiveStreamEmbed";
import { Broadcaster } from "src/schemas/broadcaster";
import { Card, CardBody } from "src/components";

const StreamPage: React.FC = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const dispatch = useAppDispatch();
  const numericSeriesId = Number(seriesId);

  console.log("StreamPage mounting with seriesId:", seriesId);

  const series = useAppSelector((state) =>
    selectSeriesById(state, numericSeriesId)
  );
  const isLoadingSeries = useAppSelector(selectSeriesLoading);
  const seriesError = useAppSelector(selectSeriesError);

  console.log("Current state:", {
    series,
    isLoadingSeries,
    seriesError,
    numericSeriesId,
  });

  const [selectedBroadcasterIndex, setSelectedBroadcasterIndex] = useState(0);

  useEffect(() => {
    console.log("Effect running, conditions:", {
      hasSeries: !!series,
      isLoadingSeries,
      hasError: !!seriesError,
    });

    if (!series && !isLoadingSeries && !seriesError) {
      console.log("Dispatching fetchSeriesById");
      dispatch(fetchSeriesById(numericSeriesId, "lol"));
    }
  }, [dispatch, numericSeriesId, series, isLoadingSeries, seriesError]);

  // Return early if loading
  if (isLoadingSeries) {
    console.log("Rendering loading state");
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-lg">Loading Stream...</div>
      </div>
    );
  }

  // Return early if there's an error
  if (seriesError) {
    console.log("Rendering error state:", seriesError);
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-lg text-red-600">Error: {seriesError}</div>
      </div>
    );
  }

  // Return early if no series found
  if (!series) {
    console.log("Rendering no series found state");
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-lg">Series not found.</div>
      </div>
    );
  }

  const { broadcasters } = series;

  console.log("Series broadcasters:", broadcasters);

  if (!broadcasters || broadcasters.length === 0) {
    console.log("Rendering no broadcasters state");
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-lg">No streams available for this series.</div>
      </div>
    );
  }

  const selectedBroadcaster: Broadcaster =
    broadcasters[selectedBroadcasterIndex];

  console.log("Rendering stream with broadcaster:", selectedBroadcaster);

  return (
    <div className="w-full h-screen p-4">
      {broadcasters.length > 1 && (
        <div className="mb-4">
          <select
            value={selectedBroadcasterIndex}
            onChange={(e) =>
              setSelectedBroadcasterIndex(Number(e.target.value))
            }
            className="w-full max-w-xs p-2 border rounded"
          >
            {broadcasters.map((broadcaster, index) => (
              <option key={broadcaster.broadcasterId} value={index}>
                {broadcaster.broadcasterName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="w-full h-[calc(100vh-120px)]">
        <LiveStreamEmbed broadcaster={selectedBroadcaster} />
      </div>
    </div>
  );
};

export default StreamPage;

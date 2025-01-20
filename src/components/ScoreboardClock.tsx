// src/components/ScoreboardClock.tsx

import React, { useState, useEffect, useMemo, useRef } from "react";

interface ScoreboardClockProps {
  liveMatch?: {
    clock?: {
      milliseconds?: number;
    } | null; // Allow clock to be null
    lifecycle?: string;
  };
  coverageFact: string;
}

const ScoreboardClock: React.FC<ScoreboardClockProps> = ({
  liveMatch,
  coverageFact,
}) => {
  // Initialize synchronization state
  const [baseServerTime, setBaseServerTime] = useState<number | null>(null);
  const [baseLocalTime, setBaseLocalTime] = useState<number | null>(null);
  const [displayTime, setDisplayTime] = useState<number | null>(null);

  const threshold = 1000; // 1 second in milliseconds

  // Refs to store the interval ID and last update time
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);

  // Effect to handle incoming payloads and set base times
  useEffect(() => {
    if (coverageFact !== "available") {
      // If coverage is not available, do not start the clock
      setBaseServerTime(null);
      setBaseLocalTime(null);
      setDisplayTime(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (liveMatch?.clock?.milliseconds != null) {
      // Update the last update time
      lastUpdateTimeRef.current = Date.now();

      if (baseServerTime === null || baseLocalTime === null) {
        // Initialize base times with the first payload
        setBaseServerTime(liveMatch.clock.milliseconds);
        setBaseLocalTime(Date.now());
        setDisplayTime(liveMatch.clock.milliseconds);
      } else {
        // Calculate expected display time based on elapsed local time
        const elapsed = Date.now() - (baseLocalTime || Date.now());
        const expectedDisplay = (baseServerTime || 0) + elapsed;

        const difference = Math.abs(
          liveMatch.clock.milliseconds - expectedDisplay
        );

        if (difference > threshold) {
          // If difference exceeds threshold, resynchronize
          setBaseServerTime(liveMatch.clock.milliseconds);
          setBaseLocalTime(Date.now());
          setDisplayTime(liveMatch.clock.milliseconds);
        }
        // Else, do not resynchronize to allow smooth ticking
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMatch?.clock?.milliseconds, coverageFact]);

  // Effect to update display time every second and stop if no update in 5 seconds
  useEffect(() => {
    if (baseServerTime === null || baseLocalTime === null) return;

    // Start the interval and store its ID in the ref
    intervalRef.current = setInterval(() => {
      if (
        lastUpdateTimeRef.current &&
        Date.now() - lastUpdateTimeRef.current >= 5000
      ) {
        // Stop incrementing if no new payload in the last 5 seconds
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const elapsed = Date.now() - (baseLocalTime || Date.now());
      setDisplayTime((baseServerTime || 0) + elapsed);
    }, 1000); // Update every second

    // Cleanup function to clear the interval when dependencies change or component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [baseServerTime, baseLocalTime]);

  // Effect to handle match end
  useEffect(() => {
    const isMatchEnded = liveMatch?.lifecycle === "over";

    if (isMatchEnded) {
      // Clear the interval to stop the clock
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Set the display time to the final payload clock value
      if (liveMatch?.clock?.milliseconds != null) {
        setDisplayTime(liveMatch.clock.milliseconds);
      }
    }
  }, [liveMatch?.lifecycle, liveMatch?.clock?.milliseconds]);

  // Format the display time
  const formattedClock = useMemo(() => {
    if (displayTime === null || coverageFact !== "available") return "Live";
    const totalSeconds = Math.floor(displayTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [displayTime, coverageFact]);

  return (
    <div>
      <div className="font-bold opacity-60 text-danger-500 dark:text-danger-500">
        {formattedClock}
      </div>
    </div>
  );
};

export default ScoreboardClock;

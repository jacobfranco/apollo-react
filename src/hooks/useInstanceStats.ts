import { useState, useEffect } from "react";

interface InstanceStats {
  userCount: number;
  statusCount: number;
  mau: number;
}

interface UseInstanceStatsReturn {
  userCount: number | undefined;
  statusCount: number | undefined;
  mau: number | undefined;
  retention: number | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const useInstanceStats = (): UseInstanceStatsReturn => {
  const [stats, setStats] = useState<InstanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/instance");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch stats"));
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const calculateRetention = (userCount: number, mau: number) => {
    if (!userCount || !mau) return undefined;
    return Math.round((mau / userCount) * 100);
  };

  return {
    userCount: stats?.userCount,
    statusCount: stats?.statusCount,
    mau: stats?.mau,
    retention: calculateRetention(stats?.userCount ?? 0, stats?.mau ?? 0),
    isLoading,
    error,
  };
};

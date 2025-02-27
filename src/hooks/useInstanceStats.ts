import { useState, useEffect } from "react";
import { useApi } from "src/hooks/useApi";
import type { ApolloResponse } from "src/api/ApolloResponse";

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
  const api = useApi();
  const [stats, setStats] = useState<InstanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = (await api.get(
          "/api/admin/instance"
        )) as ApolloResponse & InstanceStats;
        setStats({
          userCount: response.userCount,
          statusCount: response.statusCount,
          mau: response.mau,
        });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch stats"));
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [api]);

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

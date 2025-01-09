import { useQuery } from "@tanstack/react-query";

import { fetchTrendsSuccess } from "src/actions/trends";
import { useApi } from "src/hooks/useApi";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { normalizeTag } from "src/normalizers/index";

import type { Tag } from "src/types/entities";

export default function useTrends() {
  const api = useApi();
  const dispatch = useAppDispatch();

  const getTrends = async () => {
    const response = await api.get("/api/trends");
    const data: Tag[] = await response.json();

    dispatch(fetchTrendsSuccess(data));

    const normalizedData = data.map((tag) => normalizeTag(tag));
    return normalizedData;
  };

  const result = useQuery<ReadonlyArray<Tag>>({
    queryKey: ["trends"],
    queryFn: getTrends,
    placeholderData: [],
    staleTime: 600000, // 10 minutes
  });

  return result;
}

import { useQuery } from "@tanstack/react-query";

import { fetchTrendingSpacesSuccess } from "src/actions/trends";
import { useApi } from "src/hooks/useApi";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { normalizeSpace } from "src/normalizers";

import type { Space } from "src/types/entities";

export default function useTrendingSpaces() {
  const api = useApi();
  const dispatch = useAppDispatch();

  const getTrendingSpaces = async () => {
    const response = await api.get("/api/trends/spaces");
    const data: Space[] = await response.json();

    dispatch(fetchTrendingSpacesSuccess(data));

    const normalizedData = data.map((space) => normalizeSpace(space));
    return normalizedData;
  };

  const result = useQuery<ReadonlyArray<Space>>({
    queryKey: ["trending_spaces"],
    queryFn: getTrendingSpaces,
    placeholderData: [],
    staleTime: 600000, // 10 minutes
  });

  return result;
}

import { useQuery } from '@tanstack/react-query';

import { fetchTrendingSpacesSuccess } from 'src/actions/trends';
import { useApi, useAppDispatch } from 'src/hooks';
import { normalizeSpace } from 'src/normalizers';

import type { Space } from 'src/types/entities';

export default function useTrends() {
  const api = useApi();
  const dispatch = useAppDispatch();

  const getTrends = async () => {
    const { data } = await api.get<any[]>('/api/trends/spaces');

    dispatch(fetchTrendingSpacesSuccess(data));

    const normalizedData = data.map((space) => normalizeSpace(space));
    return normalizedData;
  };

  const result = useQuery<ReadonlyArray<Space>>({
    queryKey: ['trending_spaces'],
    queryFn: getTrends,
    placeholderData: [],
    staleTime: 600000, // 10 minutes
  });

  return result;
}
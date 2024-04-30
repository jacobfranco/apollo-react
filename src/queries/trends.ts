import { useQuery } from '@tanstack/react-query';

import { fetchTrendsSuccess } from 'src/actions/trends';
import { useApi, useAppDispatch } from 'src/hooks';
import { normalizeTag } from 'src/normalizers';

import type { Tag } from 'src/types/entities';

export default function useTrends() {
  const api = useApi();
  const dispatch = useAppDispatch();

  const getTrends = async() => {
    const { data } = await api.get<any[]>('/api/trends');

    dispatch(fetchTrendsSuccess(data));

    const normalizedData = data.map((tag) => normalizeTag(tag));
    return normalizedData;
  };

  const result = useQuery<ReadonlyArray<Tag>>({
    queryKey: ['trends'],
    queryFn: getTrends,
    placeholderData: [],
    staleTime: 600000, // 10 minutes
  });

  return result;
}
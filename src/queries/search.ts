import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import { useApi } from "src/hooks/useApi";
import { Account } from "src/types/entities";
import { flattenPages, PaginatedResult } from "src/utils/queries";

export default function useAccountSearch(q: string) {
  const api = useApi();

  const getAccountSearch = async (
    q: string,
    pageParam: { link?: string }
  ): Promise<PaginatedResult<Account>> => {
    const nextPageLink = pageParam?.link;
    const uri = nextPageLink || "/api/accounts/search";

    const response = await api.get(uri, {
      searchParams: {
        q,
        limit: 10,
        followers: true,
      },
    });
    const data = await response.json();

    const next = response.next();
    const hasMore = !!next;

    return {
      result: data,
      link: next ?? undefined,
      hasMore,
    };
  };

  const queryInfo = useInfiniteQuery({
    queryKey: ["search", "accounts", q],
    queryFn: ({ pageParam }) => getAccountSearch(q, pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: { link: undefined as string | undefined },
    getNextPageParam: (config) => {
      if (config.hasMore) {
        return { link: config.link };
      }

      return undefined;
    },
  });

  const data = flattenPages(queryInfo.data);

  return {
    ...queryInfo,
    data,
  };
}

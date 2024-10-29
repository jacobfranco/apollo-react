import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import { getNextLink } from "src/api";
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
      params: {
        q,
        limit: 10,
        followers: true,
      },
    });
    const { data } = response;

    const link = getNextLink(response);
    const hasMore = !!link;

    return {
      result: data,
      link,
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

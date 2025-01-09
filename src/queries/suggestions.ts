import {
  useInfiniteQuery,
  useMutation,
  keepPreviousData,
} from "@tanstack/react-query";

import { fetchRelationships } from "src/actions/accounts";
import { importFetchedAccounts } from "src/actions/importer";
import { useApi } from "src/hooks/useApi";
import { useAppDispatch } from "src/hooks/useAppDispatch";

import { PaginatedResult, removePageItem } from "../utils/queries";

import type { IAccount } from "./accounts";

type Suggestion = {
  source: "staff";
  account: IAccount;
};

type Result = {
  account: string;
};

type PageParam = {
  link?: string;
};

const SuggestionKeys = {
  suggestions: ["suggestions"] as const,
};

const useSuggestions = () => {
  const api = useApi();
  const dispatch = useAppDispatch();

  const getV2Suggestions = async (
    pageParam: PageParam
  ): Promise<PaginatedResult<Result>> => {
    const endpoint = pageParam?.link || "/api/suggestions";
    const response = await api.get(endpoint);
    const next = response.next();
    const hasMore = !!next;

    const data: Suggestion[] = await response.json();
    const accounts = data.map(({ account }) => account);
    const accountIds = accounts.map((account) => account.id);
    dispatch(importFetchedAccounts(accounts));
    dispatch(fetchRelationships(accountIds));

    return {
      result: data.map((x) => ({ ...x, account: x.account.id })),
      link: next ?? undefined,
      hasMore,
    };
  };

  const result = useInfiniteQuery({
    queryKey: SuggestionKeys.suggestions,
    queryFn: ({ pageParam }: any) => getV2Suggestions(pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: { nextLink: undefined },
    getNextPageParam: (config) => {
      if (config?.hasMore) {
        return { nextLink: config?.link };
      }

      return undefined;
    },
  });

  const data: any = result.data?.pages.reduce<Suggestion[]>(
    (prev: any, curr: any) => [...prev, ...curr.result],
    []
  );

  return {
    ...result,
    data: data || [],
  };
};

const useDismissSuggestion = () => {
  const api = useApi();

  return useMutation({
    mutationFn: (accountId: string) =>
      api.delete(`/api/suggestions/${accountId}`),
    onMutate(accountId: string) {
      removePageItem(
        SuggestionKeys.suggestions,
        accountId,
        (o: any, n: any) => o.account === n
      );
    },
  });
};

function useOnboardingSuggestions() {
  const api = useApi();
  const dispatch = useAppDispatch();

  const getV2Suggestions = async (
    pageParam: any
  ): Promise<{
    data: Suggestion[];
    link: string | undefined;
    hasMore: boolean;
  }> => {
    const link = pageParam?.link || "/api/suggestions";
    const response = await api.get(link);
    const next = response.next();
    const hasMore = !!next;

    const data: Suggestion[] = await response.json();
    const accounts = data.map(({ account }) => account);
    const accountIds = accounts.map((account) => account.id);
    dispatch(importFetchedAccounts(accounts));
    dispatch(fetchRelationships(accountIds));

    return {
      data: data,
      link: next ?? undefined,
      hasMore,
    };
  };

  const result = useInfiniteQuery({
    queryKey: ["suggestions", "v2"],
    queryFn: ({ pageParam }) => getV2Suggestions(pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: { link: undefined as string | undefined },
    getNextPageParam: (config) => {
      if (config.hasMore) {
        return { link: config.link };
      }

      return undefined;
    },
  });

  const data = result.data?.pages.reduce<Suggestion[]>(
    (prev: Suggestion[], curr) => [...prev, ...curr.data],
    []
  );

  return {
    ...result,
    data,
  };
}

export { useOnboardingSuggestions, useSuggestions, useDismissSuggestion };

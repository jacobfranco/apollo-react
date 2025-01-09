import { useInfiniteQuery } from "@tanstack/react-query";
import { useApi } from "src/hooks/useApi";
import { moderationLogEntrySchema, type ModerationLogEntry } from "src/schemas";

interface ModerationLogResult {
  items: ModerationLogEntry[];
  total: number;
}

const flattenPages = (pages?: ModerationLogResult[]): ModerationLogEntry[] =>
  (pages || []).map(({ items }) => items).flat();

const useModerationLog = () => {
  const api = useApi();

  const getModerationLog = async (
    page: number
  ): Promise<ModerationLogResult> => {
    const response = await api.get("/api/admin/moderation_log", {
      searchParams: { page },
    });
    const data: ModerationLogResult = await response.json();

    const normalizedData = data.items.map((domain) =>
      moderationLogEntrySchema.parse(domain)
    );

    return {
      items: normalizedData,
      total: data.total,
    };
  };

  const queryInfo = useInfiniteQuery({
    queryKey: ["admin", "moderation_log"],
    queryFn: ({ pageParam }) => getModerationLog(pageParam),
    initialPageParam: 1,
    getNextPageParam: (page, allPages) =>
      flattenPages(allPages)!.length >= page.total
        ? undefined
        : allPages.length + 1,
  });

  const data = flattenPages(queryInfo.data?.pages);

  return {
    ...queryInfo,
    data,
  };
};

export { useModerationLog };

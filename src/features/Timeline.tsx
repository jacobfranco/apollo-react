import { OrderedSet as ImmutableOrderedSet } from "immutable";
import { debounce } from "es-toolkit";
import React, { useCallback } from "react";
import { defineMessages } from "react-intl";

import { dequeueTimeline, scrollTopTimeline } from "src/actions/timelines";
import StatusList, { IStatusList } from "src/components/StatusList";
import { Portal, ScrollTopButton } from "src/components";
import { useAppSelector, useAppDispatch } from "src/hooks";
import { makeGetStatusIds } from "src/selectors";

const messages = defineMessages({
  queue: {
    id: "status_list.queue_label",
    defaultMessage:
      "Click to see {count} new {count, plural, one {post} other {posts}}",
  },
});

interface ITimeline
  extends Omit<IStatusList, "statusIds" | "isLoading" | "hasMore"> {
  /** ID of the timeline in Redux. */
  timelineId: string;
  /** Settings path to use instead of the timelineId. */
  prefix?: string;
}

/** Scrollable list of statuses from a timeline in the Redux store. */
const Timeline: React.FC<ITimeline> = ({
  timelineId,
  onLoadMore,
  prefix,
  ...rest
}) => {
  const dispatch = useAppDispatch();
  const getStatusIds = useCallback(makeGetStatusIds(), []);

  const lastStatusId = useAppSelector(
    (state) =>
      (
        state.timelines.get(timelineId)?.items || ImmutableOrderedSet()
      ).last() as string | undefined
  );
  const statusIds = useAppSelector((state) =>
    getStatusIds(state, { type: timelineId, prefix })
  );
  const isLoading = useAppSelector(
    (state) =>
      (state.timelines.get(timelineId) || { isLoading: true }).isLoading ===
      true
  );
  const isPartial = useAppSelector(
    (state) => (state.timelines.get(timelineId)?.isPartial || false) === true
  );
  const hasMore = useAppSelector(
    (state) => state.timelines.get(timelineId)?.hasMore === true
  );
  const totalQueuedItemsCount = useAppSelector(
    (state) => state.timelines.get(timelineId)?.totalQueuedItemsCount || 0
  );

  const handleDequeueTimeline = useCallback(() => {
    dispatch(dequeueTimeline(timelineId, onLoadMore));
  }, []);

  const handleScrollToTop = useCallback(
    debounce(() => {
      dispatch(scrollTopTimeline(timelineId, true));
    }, 100),
    [timelineId]
  );

  const handleScroll = useCallback(
    debounce(() => {
      dispatch(scrollTopTimeline(timelineId, false));
    }, 100),
    [timelineId]
  );

  return (
    <>
      <Portal>
        <ScrollTopButton
          key="timeline-queue-button-header"
          onClick={handleDequeueTimeline}
          count={totalQueuedItemsCount}
          message={messages.queue}
        />
      </Portal>

      <StatusList
        timelineId={timelineId}
        onScrollToTop={handleScrollToTop}
        onScroll={handleScroll}
        lastStatusId={lastStatusId}
        statusIds={statusIds}
        isLoading={isLoading}
        isPartial={isPartial}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        {...rest}
      />
    </>
  );
};

export default Timeline;

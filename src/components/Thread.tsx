import { createSelector } from "@reduxjs/toolkit";
import clsx from "clsx";
import {
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
} from "immutable";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { type VirtuosoHandle } from "react-virtuoso";

import { mentionCompose, replyCompose } from "src/actions/compose";
import { like, repost, unlike, unrepost } from "src/actions/interactions";
import { openModal } from "src/actions/modals";
import { getSettings } from "src/actions/settings";
import { hideStatus, revealStatus } from "src/actions/statuses";
import {
  DetailedStatus,
  PendingStatus,
  PlaceholderStatus,
  ScrollableList,
  Stack,
  StatusActionBar,
  ThreadStatus,
} from "src/components";
import { HotKeys } from "src/features/Hotkeys";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { useSettings } from "src/hooks/useSettings";
import { RootState } from "src/store";
import { type Account, type Status } from "src/types/entities";
import { defaultMediaVisibility, textForScreenReader } from "src/utils/status";

type DisplayMedia = "default" | "hide_all" | "show_all";

const getAncestorsIds = createSelector(
  [
    (_: RootState, statusId: string | undefined) => statusId,
    (state: RootState) => state.contexts.inReplyTos,
  ],
  (statusId, inReplyTos) => {
    let ancestorsIds = ImmutableOrderedSet<string>();
    let id: string | undefined = statusId;

    while (id && !ancestorsIds.includes(id)) {
      ancestorsIds = ImmutableOrderedSet([id]).union(ancestorsIds);
      id = inReplyTos.get(id);
    }

    return ancestorsIds;
  }
);

export const getDescendantsIds = createSelector(
  [
    (_: RootState, statusId: string) => statusId,
    (state: RootState) => state.contexts.replies,
  ],
  (statusId, contextReplies) => {
    let descendantsIds = ImmutableOrderedSet<string>();
    const ids = [statusId];

    while (ids.length > 0) {
      const id = ids.shift();
      if (!id) break;

      const replies = contextReplies.get(id);

      if (descendantsIds.includes(id)) {
        break;
      }

      if (statusId !== id) {
        descendantsIds = descendantsIds.union([id]);
      }

      if (replies) {
        replies.reverse().forEach((reply: string) => {
          ids.unshift(reply);
        });
      }
    }

    return descendantsIds;
  }
);

interface IThread {
  status: Status;
  withMedia?: boolean;
  useWindowScroll?: boolean;
  itemClassName?: string;
  next?: string | null;
  handleLoadMore: () => void;
}

const Thread = (props: IThread) => {
  const {
    handleLoadMore,
    itemClassName,
    next,
    status,
    useWindowScroll = true,
    withMedia = true,
  } = props;

  const dispatch = useAppDispatch();
  const history = useHistory();
  const intl = useIntl();
  const { displayMedia } = useSettings();

  const isUnderReview = status?.visibility === "self";

  const { ancestorsIds, descendantsIds } = useAppSelector((state) => {
    let ancestorsIds = ImmutableOrderedSet<string>();
    let descendantsIds = ImmutableOrderedSet<string>();

    if (status) {
      const statusId = status.id;
      ancestorsIds = getAncestorsIds(
        state,
        state.contexts.inReplyTos.get(statusId)
      );
      descendantsIds = getDescendantsIds(state, statusId);
      ancestorsIds = ancestorsIds.delete(statusId).subtract(descendantsIds);
      descendantsIds = descendantsIds.delete(statusId).subtract(ancestorsIds);
    }

    return {
      status,
      ancestorsIds,
      descendantsIds,
    };
  });

  let initialTopMostItemIndex = ancestorsIds.size;
  if (!useWindowScroll && initialTopMostItemIndex !== 0)
    initialTopMostItemIndex = ancestorsIds.size + 1;

  const [showMedia, setShowMedia] = useState<boolean>(
    status?.visibility === "self"
      ? false
      : defaultMediaVisibility(status, displayMedia)
  );

  const node = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<VirtuosoHandle>(null);

  const handleToggleMediaVisibility = () => {
    setShowMedia(!showMedia);
  };

  const handleHotkeyReact = () => {
    if (statusRef.current) {
      const firstEmoji: HTMLButtonElement | null =
        statusRef.current.querySelector(
          ".emoji-react-selector .emoji-react-selector__emoji"
        );
      firstEmoji?.focus();
    }
  };

  const handleLikeClick = (status: Status) => {
    if (status.liked) {
      dispatch(unlike(status));
    } else {
      dispatch(like(status));
    }
  };

  const handleReplyClick = (status: Status) => dispatch(replyCompose(status));

  const handleModalRepost = (status: Status) => dispatch(repost(status));

  const handleRepostClick = (status: Status, e?: React.MouseEvent) => {
    dispatch((_, getState) => {
      const boostModal = getSettings(getState()).get("boostModal");
      if (status.reposted) {
        dispatch(unrepost(status));
      } else {
        if ((e && e.shiftKey) || !boostModal) {
          handleModalRepost(status);
        } else {
          dispatch(openModal("BOOST", { status, onRepost: handleModalRepost }));
        }
      }
    });
  };

  const handleMentionClick = (account: Account) =>
    dispatch(mentionCompose(account));

  const handleHotkeyOpenMedia = (e?: KeyboardEvent) => {
    const media = status?.media_attachments;

    e?.preventDefault();

    if (media && media.size) {
      const firstAttachment = media.first()!;

      if (media.size === 1 && firstAttachment.type === "video") {
        dispatch(
          openModal("VIDEO", { media: firstAttachment, status: status })
        );
      } else {
        dispatch(openModal("MEDIA", { media, index: 0, status: status }));
      }
    }
  };

  const handleToggleHidden = (status: Status) => {
    if (status.hidden) {
      dispatch(revealStatus(status.id));
    } else {
      dispatch(hideStatus(status.id));
    }
  };

  const handleHotkeyMoveUp = () => {
    handleMoveUp(status!.id);
  };

  const handleHotkeyMoveDown = () => {
    handleMoveDown(status!.id);
  };

  const handleHotkeyReply = (e?: KeyboardEvent) => {
    e?.preventDefault();
    handleReplyClick(status!);
  };

  const handleHotkeyLike = () => {
    handleLikeClick(status!);
  };

  const handleHotkeyBoost = () => {
    handleRepostClick(status!);
  };

  const handleHotkeyMention = (e?: KeyboardEvent) => {
    e?.preventDefault();
    const { account } = status!;
    if (!account || typeof account !== "object") return;
    handleMentionClick(account);
  };

  const handleHotkeyOpenProfile = () => {
    history.push(`/@${status!.getIn(["account", "username"])}`);
  };

  const handleHotkeyToggleHidden = () => {
    handleToggleHidden(status!);
  };

  const handleHotkeyToggleSensitive = () => {
    handleToggleMediaVisibility();
  };

  const handleMoveUp = (id: string) => {
    if (id === status?.id) {
      _selectChild(ancestorsIds.size - 1);
    } else {
      let index = ImmutableList(ancestorsIds).indexOf(id);

      if (index === -1) {
        index = ImmutableList(descendantsIds).indexOf(id);
        _selectChild(ancestorsIds.size + index);
      } else {
        _selectChild(index - 1);
      }
    }
  };

  const handleMoveDown = (id: string) => {
    if (id === status?.id) {
      _selectChild(ancestorsIds.size + 1);
    } else {
      let index = ImmutableList(ancestorsIds).indexOf(id);

      if (index === -1) {
        index = ImmutableList(descendantsIds).indexOf(id);
        _selectChild(ancestorsIds.size + index + 2);
      } else {
        _selectChild(index + 1);
      }
    }
  };

  const _selectChild = (index: number) => {
    if (!useWindowScroll) index = index + 1;
    scroller.current?.scrollIntoView({
      index,
      behavior: "smooth",
      done: () => {
        node.current
          ?.querySelector<HTMLDivElement>(`[data-index="${index}"] .focusable`)
          ?.focus();
      },
    });
  };

  const renderStatus = (id: string) => {
    return (
      <ThreadStatus
        key={id}
        id={id}
        focusedStatusId={status!.id}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        contextType="thread"
      />
    );
  };

  const renderPendingStatus = (id: string) => {
    const idempotencyKey = id.replace(/^末pending-/, "");

    return <PendingStatus key={id} idempotencyKey={idempotencyKey} thread />;
  };

  const renderChildren = (list: ImmutableOrderedSet<string>) => {
    return list.map((id) => {
      if (id.startsWith("末pending-")) {
        return renderPendingStatus(id);
      } else {
        return renderStatus(id);
      }
    });
  };

  // Reset media visibility if status changes.
  useEffect(() => {
    setShowMedia(
      status?.visibility === "self"
        ? false
        : defaultMediaVisibility(status, displayMedia)
    );
  }, [status.id]);

  // Scroll focused status into view when thread updates.
  useEffect(() => {
    scroller.current?.scrollToIndex({
      index: ancestorsIds.size,
      offset: -146,
    });

    setTimeout(
      () =>
        statusRef.current
          ?.querySelector<HTMLDivElement>(".detailed-actualStatus")
          ?.focus(),
      0
    );
  }, [status.id, ancestorsIds.size]);

  const hasAncestors = ancestorsIds.size > 0;
  const hasDescendants = descendantsIds.size > 0;

  type HotkeyHandlers = { [key: string]: (keyEvent?: KeyboardEvent) => void };

  const handlers: HotkeyHandlers = {
    moveUp: handleHotkeyMoveUp,
    moveDown: handleHotkeyMoveDown,
    reply: handleHotkeyReply,
    like: handleHotkeyLike,
    boost: handleHotkeyBoost,
    mention: handleHotkeyMention,
    openProfile: handleHotkeyOpenProfile,
    toggleHidden: handleHotkeyToggleHidden,
    toggleSensitive: handleHotkeyToggleSensitive,
    openMedia: handleHotkeyOpenMedia,
    react: handleHotkeyReact,
  };

  const focusedStatus = (
    <div className={clsx({ "pb-4": hasDescendants })} key={status.id}>
      <HotKeys handlers={handlers}>
        <div
          ref={statusRef}
          className="focusable relative"
          tabIndex={0}
          // FIXME: no "reposted by" text is added for the screen reader
          aria-label={textForScreenReader(intl, status)}
        >
          <DetailedStatus
            status={status}
            showMedia={showMedia}
            withMedia={withMedia}
            onToggleMediaVisibility={handleToggleMediaVisibility}
          />

          {!isUnderReview ? (
            <>
              <hr className="-mx-4 mb-2 max-w-[100vw] border-t-2 dark:border-gray-800" />

              <StatusActionBar status={status} expandable={false} space="lg" />
            </>
          ) : null}
        </div>
      </HotKeys>

      {hasDescendants && (
        <hr className="-mx-4 mt-2 max-w-[100vw] border-t-2 dark:border-gray-800" />
      )}
    </div>
  );

  const children: JSX.Element[] = [];

  if (!useWindowScroll) {
    // Add padding to the top of the Thread (for Media Modal)
    children.push(<div key="padding" className="h-4" />);
  }

  if (hasAncestors) {
    children.push(...renderChildren(ancestorsIds).toArray());
  }

  children.push(focusedStatus);

  if (hasDescendants) {
    children.push(...renderChildren(descendantsIds).toArray());
  }

  return (
    <Stack
      space={2}
      className={clsx({
        "h-full": !useWindowScroll,
        "mt-2": useWindowScroll,
      })}
    >
      <div
        ref={node}
        className={clsx("thread", {
          "h-full": !useWindowScroll,
        })}
      >
        <ScrollableList
          id="thread"
          ref={scroller}
          hasMore={!!next}
          onLoadMore={handleLoadMore}
          placeholderComponent={() => <PlaceholderStatus variant="slim" />}
          initialTopMostItemIndex={initialTopMostItemIndex}
          useWindowScroll={useWindowScroll}
          itemClassName={itemClassName}
          className={clsx({
            "h-full": !useWindowScroll,
          })}
        >
          {children}
        </ScrollableList>
      </div>
    </Stack>
  );
};

export default Thread;

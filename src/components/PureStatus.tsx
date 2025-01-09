import circlesIcon from "@tabler/icons/outline/circles.svg";
import pinnedIcon from "@tabler/icons/outline/pinned.svg";
import repeatIcon from "@tabler/icons/outline/repeat.svg";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useIntl, FormattedMessage, defineMessages } from "react-intl";
import { Link, useHistory } from "react-router-dom";

import { openModal } from "src/actions/modals";
import { unfilterStatus } from "src/actions/statuses";
import PureStatusContent from "src/components/PureStatusContent";
import PureStatusReplyMentions from "src/components/PureStatusReplyMentions";
import PureTranslateButton from "src/components/PureTranslateButton";
import PureSensitiveContentOverlay from "src/components/PureSensitiveContentOverlay";
import { Card } from "src/components/Card";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import AccountContainer from "src/containers/AccountContainer";
import QuotedStatus from "src/containers/StatusQuotedStatusContainer";
import { HotKeys } from "src/features/Hotkeys";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useLike } from "src/hooks/useLike";
import { useMentionCompose } from "src/hooks/useMentionCompose";
import { useRepost } from "src/hooks/useRepost";
import { useReplyCompose } from "src/hooks/useReplyCompose";
import { useSettings } from "src/hooks/useSettings";
import { useStatusHidden } from "src/hooks/useStatusHidden";
import { normalizeStatus } from "src/normalizers/index";
import { Status as StatusEntity } from "src/schemas/index";
import { Status as LegacyStatus } from "src/types/entities";
import {
  defaultMediaVisibility,
  textForScreenReader,
  getActualStatus,
} from "src/utils/status";

import StatusActionBar from "./StatusActionBar";
import StatusMedia from "./StatusMedia";
import StatusInfo from "./StatusInfo";

// Defined in components/scrollable-list
export type ScrollPosition = { height: number; top: number };

const messages = defineMessages({
  reposted_by: { id: "status.reposted_by", defaultMessage: "{name} reposted" },
});

export interface IPureStatus {
  id?: string;
  avatarSize?: number;
  status: StatusEntity;
  onClick?: () => void;
  muted?: boolean;
  hidden?: boolean;
  unread?: boolean;
  onMoveUp?: (statusId: string, featured?: boolean) => void;
  onMoveDown?: (statusId: string, featured?: boolean) => void;
  focusable?: boolean;
  featured?: boolean;
  hideActionBar?: boolean;
  hoverable?: boolean;
  variant?: "default" | "rounded" | "slim";
  showGroup?: boolean;
  accountAction?: React.ReactElement;
}

/**
 * Status accepting the full status entity in pure format.
 */
const PureStatus: React.FC<IPureStatus> = (props) => {
  const {
    status,
    accountAction,
    avatarSize = 42,
    focusable = true,
    hoverable = true,
    onClick,
    onMoveUp,
    onMoveDown,
    muted,
    hidden,
    featured,
    unread,
    hideActionBar,
    variant = "rounded",
    showGroup = true,
  } = props;

  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { displayMedia, boostModal } = useSettings();
  const didShowCard = useRef(false);
  const node = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const [showMedia, setShowMedia] = useState<boolean>(
    defaultMediaVisibility(status, displayMedia)
  );
  const [minHeight, setMinHeight] = useState(208);

  const actualStatus = getActualStatus(status);
  const isRepost = status.repost && typeof status.repost === "object";
  const statusUrl = `/@${actualStatus.account.username}/posts/${actualStatus.id}`;
  const group = actualStatus.group;

  const filtered = (status.filtered.length || actualStatus.filtered.length) > 0;

  const { replyCompose } = useReplyCompose();
  const { mentionCompose } = useMentionCompose();
  const { toggleLike } = useLike();
  const { toggleRepost } = useRepost();
  const { toggleStatusHidden } = useStatusHidden();

  // Track height changes we know about to compensate scrolling.
  useEffect(() => {
    didShowCard.current = Boolean(!muted && !hidden && status?.card);
  }, []);

  useEffect(() => {
    setShowMedia(defaultMediaVisibility(status, displayMedia));
  }, [status.id]);

  useEffect(() => {
    if (overlay.current) {
      setMinHeight(overlay.current.getBoundingClientRect().height);
    }
  }, [overlay.current]);

  const statusImmutable = normalizeStatus(status) as LegacyStatus; // TODO: remove this line, it will be removed once all components in this file are pure.

  const handleToggleMediaVisibility = (): void => {
    setShowMedia(!showMedia);
  };

  const handleClick = (e?: React.MouseEvent): void => {
    e?.stopPropagation();

    // If the user is selecting text, don't focus the status.
    if (getSelection()?.toString().length) {
      return;
    }

    if (!e || !(e.ctrlKey || e.metaKey)) {
      if (onClick) {
        onClick();
      } else {
        history.push(statusUrl);
      }
    } else {
      window.open(statusUrl, "_blank");
    }
  };

  const handleHotkeyOpenMedia = (e?: KeyboardEvent): void => {
    const status = actualStatus;
    const firstAttachment = status.media_attachments[0];

    e?.preventDefault();

    if (firstAttachment) {
      if (firstAttachment.type === "video") {
        dispatch(
          openModal("VIDEO", { status, media: firstAttachment, time: 0 })
        );
      } else {
        dispatch(
          openModal("MEDIA", {
            status,
            media: status.media_attachments,
            index: 0,
          })
        );
      }
    }
  };

  const handleHotkeyReply = (e?: KeyboardEvent): void => {
    e?.preventDefault();
    replyCompose(status.id);
  };

  const handleHotkeyLike = (): void => {
    toggleLike(status.id);
  };

  const handleHotkeyBoost = (e?: KeyboardEvent): void => {
    const modalRepost = () => toggleRepost(status.id);
    if ((e && e.shiftKey) || !boostModal) {
      modalRepost();
    } else {
      dispatch(openModal("BOOST", { status: status, onRepost: modalRepost }));
    }
  };

  const handleHotkeyMention = (e?: KeyboardEvent): void => {
    e?.preventDefault();
    mentionCompose(actualStatus.account);
  };

  const handleHotkeyOpen = (): void => {
    history.push(statusUrl);
  };

  const handleHotkeyOpenProfile = (): void => {
    history.push(`/@${actualStatus.account.username}`);
  };

  const handleHotkeyMoveUp = (e?: KeyboardEvent): void => {
    if (onMoveUp) {
      onMoveUp(status.id, featured);
    }
  };

  const handleHotkeyMoveDown = (e?: KeyboardEvent): void => {
    if (onMoveDown) {
      onMoveDown(status.id, featured);
    }
  };

  const handleHotkeyToggleHidden = (): void => {
    toggleStatusHidden(status.id);
  };

  const handleHotkeyToggleSensitive = (): void => {
    handleToggleMediaVisibility();
  };

  const handleHotkeyReact = (): void => {
    _expandEmojiSelector();
  };

  const handleUnfilter = () =>
    dispatch(
      unfilterStatus(status.filtered.length ? status.id : actualStatus.id)
    );

  const _expandEmojiSelector = (): void => {
    const firstEmoji: HTMLDivElement | null | undefined =
      node.current?.querySelector(
        ".emoji-react-selector .emoji-react-selector__emoji"
      );
    firstEmoji?.focus();
  };

  const renderStatusInfo = () => {
    if (isRepost && showGroup && group) {
      return (
        <StatusInfo
          avatarSize={avatarSize}
          icon={<Icon src={repeatIcon} className="size-4 text-green-600" />}
          text={
            <FormattedMessage
              id="status.reposted_by_with_group"
              defaultMessage="{name} reposted from {group}"
              values={{
                name: (
                  <Link
                    to={`/@${status.account.username}`}
                    className="hover:underline"
                  >
                    <bdi className="truncate">
                      <strong className="text-gray-800 dark:text-gray-200">
                        {status.account.display_name}
                      </strong>
                    </bdi>
                  </Link>
                ),
                group: (
                  <Link to={`/group/${group.slug}`} className="hover:underline">
                    <strong className="text-gray-800 dark:text-gray-200">
                      {group.display_name}
                    </strong>
                  </Link>
                ),
              }}
            />
          }
        />
      );
    } else if (isRepost) {
      return (
        <StatusInfo
          avatarSize={avatarSize}
          icon={<Icon src={repeatIcon} className="size-4 text-green-600" />}
          text={
            <FormattedMessage
              id="status.reposted_by"
              defaultMessage="{name} reposted"
              values={{
                name: (
                  <Link
                    to={`/@${status.account.username}`}
                    className="hover:underline"
                  >
                    <bdi className="truncate">
                      <strong className="text-gray-800 dark:text-gray-200">
                        {status.account.display_name}
                      </strong>
                    </bdi>
                  </Link>
                ),
              }}
            />
          }
        />
      );
    } else if (featured) {
      return (
        <StatusInfo
          avatarSize={avatarSize}
          icon={
            <Icon
              src={pinnedIcon}
              className="size-4 text-gray-600 dark:text-gray-400"
            />
          }
          text={
            <FormattedMessage id="status.pinned" defaultMessage="Pinned post" />
          }
        />
      );
    } else if (showGroup && group) {
      return (
        <StatusInfo
          avatarSize={avatarSize}
          icon={
            <Icon
              src={circlesIcon}
              className="size-4 text-primary-600 dark:text-accent-blue"
            />
          }
          text={
            <FormattedMessage
              id="status.group"
              defaultMessage="Posted in {group}"
              values={{
                group: (
                  <Link to={`/group/${group.slug}`} className="hover:underline">
                    <bdi className="truncate">
                      <strong className="text-gray-800 dark:text-gray-200">
                        <span>{group.display_name}</span>
                      </strong>
                    </bdi>
                  </Link>
                ),
              }}
            />
          }
        />
      );
    }
  };

  if (!status) return null;

  if (hidden) {
    return (
      <div ref={node}>
        <>
          {actualStatus.account.display_name || actualStatus.account.username}
          {actualStatus.content}
        </>
      </div>
    );
  }

  if (filtered && status.showFiltered) {
    const minHandlers = muted
      ? undefined
      : {
          moveUp: handleHotkeyMoveUp,
          moveDown: handleHotkeyMoveDown,
        };

    return (
      <HotKeys handlers={minHandlers}>
        <div
          className={clsx("status--wrapper text-center", { focusable })}
          tabIndex={focusable ? 0 : undefined}
          ref={node}
        >
          {/* eslint-disable formatjs/no-literal-string-in-jsx */}
          <Text theme="muted">
            <FormattedMessage id="status.filtered" defaultMessage="Filtered" />:{" "}
            {status.filtered.join(", ")}.{" "}
            <button
              className="text-primary-600 hover:underline dark:text-accent-blue"
              onClick={handleUnfilter}
            >
              <FormattedMessage
                id="status.show_filter_reason"
                defaultMessage="Show anyway"
              />
            </button>
          </Text>
          {/* eslint-enable formatjs/no-literal-string-in-jsx */}
        </div>
      </HotKeys>
    );
  }

  let repostedByText;
  if (status.repost && typeof status.repost === "object") {
    repostedByText = intl.formatMessage(messages.reposted_by, {
      name: status.account.username,
    });
  }

  let quote;

  if (actualStatus.quote) {
    if ((actualStatus?.pleroma?.quote_visible ?? true) === false) {
      quote = (
        <div>
          <p>
            <FormattedMessage
              id="statuses.quote_tombstone"
              defaultMessage="Post is unavailable."
            />
          </p>
        </div>
      );
    } else {
      quote = <QuotedStatus statusId={actualStatus.quote.id} />;
    }
  }

  const handlers = muted
    ? undefined
    : {
        reply: handleHotkeyReply,
        like: handleHotkeyLike,
        boost: handleHotkeyBoost,
        mention: handleHotkeyMention,
        open: handleHotkeyOpen,
        openProfile: handleHotkeyOpenProfile,
        moveUp: handleHotkeyMoveUp,
        moveDown: handleHotkeyMoveDown,
        toggleHidden: handleHotkeyToggleHidden,
        toggleSensitive: handleHotkeyToggleSensitive,
        openMedia: handleHotkeyOpenMedia,
        react: handleHotkeyReact,
      };

  const isUnderReview = actualStatus.visibility === "self";
  const isSensitive = actualStatus.hidden;

  return (
    <HotKeys handlers={handlers} data-testid="status">
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        className={clsx("status cursor-pointer", { focusable })}
        tabIndex={focusable && !muted ? 0 : undefined}
        data-featured={featured ? "true" : null}
        aria-label={textForScreenReader(intl, actualStatus, repostedByText)}
        ref={node}
        onClick={handleClick}
        role="link"
      >
        <Card
          variant={variant}
          className={clsx("status--wrapper space-y-4", {
            "py-6 sm:p-5": variant === "rounded",
            muted,
            read: unread === false,
          })}
          data-id={status.id}
        >
          {renderStatusInfo()}

          <AccountContainer
            key={actualStatus.account.id}
            id={actualStatus.account.id}
            timestamp={actualStatus.created_at}
            timestampUrl={statusUrl}
            action={accountAction}
            hideActions={!accountAction}
            showEdit={!!actualStatus.edited_at}
            showProfileHoverCard={hoverable}
            withLinkToProfile={hoverable}
            approvalStatus={actualStatus.approval_status}
            avatarSize={avatarSize}
          />

          <div className="status--content-wrapper">
            <PureStatusReplyMentions status={status} hoverable={hoverable} />

            <Stack
              className="relative z-0"
              style={{
                minHeight:
                  isUnderReview || isSensitive
                    ? Math.max(minHeight, 208) + 12
                    : undefined,
              }}
            >
              {(isUnderReview || isSensitive) && (
                <PureSensitiveContentOverlay
                  status={status}
                  visible={showMedia}
                  onToggleVisibility={handleToggleMediaVisibility}
                  ref={overlay}
                />
              )}

              <Stack space={4}>
                <PureStatusContent
                  status={status}
                  onClick={handleClick}
                  collapsable
                  translatable
                />

                <PureTranslateButton status={status} />

                {(quote ||
                  actualStatus.card ||
                  actualStatus.media_attachments.length > 0) && (
                  <Stack space={4}>
                    <StatusMedia
                      status={status}
                      muted={muted}
                      onClick={handleClick}
                      showMedia={showMedia}
                      onToggleVisibility={handleToggleMediaVisibility}
                    />

                    {quote}
                  </Stack>
                )}
              </Stack>
            </Stack>

            {!hideActionBar && !isUnderReview && (
              <div className="pt-4">
                <StatusActionBar status={statusImmutable} />{" "}
                {/* FIXME: stop using 'statusImmutable' and use 'status' variable directly, for that create a new component called 'PureStatusActionBar' */}
              </div>
            )}
          </div>
        </Card>
      </div>
    </HotKeys>
  );
};

export default PureStatus;

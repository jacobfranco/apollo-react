import React, { useCallback } from "react";
import {
  defineMessages,
  useIntl,
  FormattedMessage,
  IntlShape,
  MessageDescriptor,
  defineMessage,
} from "react-intl";
import { Link, useHistory } from "react-router-dom";

import { mentionCompose } from "src/actions/compose";
import { repost, like, unrepost, unlike } from "src/actions/interactions";
import { openModal } from "src/actions/modals";
import { getSettings } from "src/actions/settings";
import { hideStatus, revealStatus } from "src/actions/statuses";
import { Emoji, HStack, Text } from "src/components";
import { default as Icon } from 'src/components/Icon'
import AccountContainer from "src/containers/AccountContainer";
import StatusContainer from "src/containers/StatusContainer";
import { HotKeys } from "src/features/Hotkeys";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { makeGetNotification } from "src/selectors";
import { NotificationType, validType } from "src/utils/notification";

import type { ScrollPosition } from "src/components/Status";
import type {
  Account as AccountEntity,
  Status as StatusEntity,
  Notification as NotificationEntity,
} from "src/types/entities";

const notificationForScreenReader = (
  intl: IntlShape,
  message: string,
  timestamp: Date
) => {
  const output = [message];

  output.push(
    intl.formatDate(timestamp, {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    })
  );

  return output.join(", ");
};

const buildLink = (account: AccountEntity): JSX.Element => (
  <bdi>
    <Link
      className="font-bold text-gray-800 hover:underline dark:text-gray-200"
      title={account.username}
      to={`/@${account.username}`}
      dangerouslySetInnerHTML={{ __html: account.display_name_html }}
    />
  </bdi>
);

// TODO: Maybe take out some of these
const icons: Record<NotificationType, string> = {
  follow: require("@tabler/icons/outline/user-plus.svg"),
  follow_request: require("@tabler/icons/outline/user-plus.svg"),
  mention: require("@tabler/icons/outline/at.svg"),
  like: require("@tabler/icons/outline/heart.svg"),
  group_like: require("@tabler/icons/outline/heart.svg"),
  repost: require("@tabler/icons/outline/repeat.svg"),
  group_repost: require("@tabler/icons/outline/repeat.svg"),
  status: require("@tabler/icons/outline/bell-ringing.svg"),
  poll: require("@tabler/icons/outline/chart-bar.svg"),
  move: require("@tabler/icons/outline/briefcase.svg"),
  user_approved: require("@tabler/icons/outline/user-plus.svg"),
  update: require("@tabler/icons/outline/pencil.svg"),
};

const nameMessage = defineMessage({
  id: "notification.name",
  defaultMessage: "{link}{others}",
});

const messages: Record<NotificationType, MessageDescriptor> = defineMessages({
  follow: {
    id: "notification.follow",
    defaultMessage: "{name} followed you",
  },
  follow_request: {
    id: "notification.follow_request",
    defaultMessage: "{name} has requested to follow you",
  },
  mention: {
    id: "notification.mentioned",
    defaultMessage: "{name} mentioned you",
  },
  like: {
    id: "notification.like",
    defaultMessage: "{name} liked your post",
  },
  group_like: {
    id: "notification.group_like",
    defaultMessage: "{name} liked your group post",
  },
  repost: {
    id: "notification.repost",
    defaultMessage: "{name} reposted your post",
  },
  group_repost: {
    id: "notification.group_repost",
    defaultMessage: "{name} reposted your group post",
  },
  status: {
    id: "notification.status",
    defaultMessage: "{name} just posted",
  },
  poll: {
    id: "notification.poll",
    defaultMessage: "A poll you have voted in has ended",
  },
  move: {
    id: "notification.move",
    defaultMessage: "{name} moved to {targetName}",
  },
  user_approved: {
    id: "notification.user_approved",
    defaultMessage: "Welcome to {instance}!",
  },
  update: {
    id: "notification.update",
    defaultMessage: "{name} edited a post you interacted with",
  },
});

const buildMessage = (
  intl: IntlShape,
  type: NotificationType,
  account: AccountEntity,
  totalCount: number | null,
  targetName: string,
  instanceTitle: string
): React.ReactNode => {
  const link = buildLink(account);
  const name = intl.formatMessage(nameMessage, {
    link,
    others:
      totalCount && totalCount > 0 ? (
        <FormattedMessage
          id="notification.others"
          defaultMessage="+ {count, plural, one {# other} other {# others}}"
          values={{ count: totalCount - 1 }}
        />
      ) : (
        ""
      ),
  });

  return intl.formatMessage(messages[type], {
    name,
    targetName,
    instance: instanceTitle,
  });
};

const avatarSize = 48;

interface INotification {
  hidden?: boolean;
  notification: NotificationEntity;
  onMoveUp?: (notificationId: string) => void;
  onMoveDown?: (notificationId: string) => void;
  onRepost?: (status: StatusEntity, e?: KeyboardEvent) => void;
  getScrollPosition?: () => ScrollPosition | undefined;
  updateScrollBottom?: (bottom: number) => void;
}

const Notification: React.FC<INotification> = (props) => {
  const { hidden = false, onMoveUp, onMoveDown } = props;

  const dispatch = useAppDispatch();

  const getNotification = useCallback(makeGetNotification(), []);

  const notification = useAppSelector((state) =>
    getNotification(state, props.notification)
  );

  const history = useHistory();
  const intl = useIntl();

  const type = notification.type;
  const { account, status } = notification;

  const getHandlers = () => ({
    reply: handleMention,
    like: handleHotkeyLike,
    boost: handleHotkeyBoost,
    mention: handleMention,
    open: handleOpen,
    openProfile: handleOpenProfile,
    moveUp: handleMoveUp,
    moveDown: handleMoveDown,
    toggleHidden: handleHotkeyToggleHidden,
  });

  const handleOpen = () => {
    if (
      status &&
      typeof status === "object" &&
      account &&
      typeof account === "object"
    ) {
      history.push(`/@${account.username}/posts/${status.id}`);
    } else {
      handleOpenProfile();
    }
  };

  const handleOpenProfile = () => {
    if (account && typeof account === "object") {
      history.push(`/@${account.username}`);
    }
  };

  const handleMention = useCallback(
    (e?: KeyboardEvent) => {
      e?.preventDefault();

      if (account && typeof account === "object") {
        dispatch(mentionCompose(account));
      }
    },
    [account]
  );

  const handleHotkeyLike = useCallback(
    (e?: KeyboardEvent) => {
      if (status && typeof status === "object") {
        if (status.liked) {
          dispatch(unlike(status));
        } else {
          dispatch(like(status));
        }
      }
    },
    [status]
  );

  const handleHotkeyBoost = useCallback(
    (e?: KeyboardEvent) => {
      if (status && typeof status === "object") {
        dispatch((_, getState) => {
          const boostModal = getSettings(getState()).get("boostModal");
          if (status.reposted) {
            dispatch(unrepost(status));
          } else {
            if (e?.shiftKey || !boostModal) {
              dispatch(repost(status));
            } else {
              dispatch(
                openModal("BOOST", {
                  status,
                  onRepost: (status: StatusEntity) => {
                    dispatch(repost(status));
                  },
                })
              );
            }
          }
        });
      }
    },
    [status]
  );

  const handleHotkeyToggleHidden = useCallback(
    (e?: KeyboardEvent) => {
      if (status && typeof status === "object") {
        if (status.hidden) {
          dispatch(revealStatus(status.id));
        } else {
          dispatch(hideStatus(status.id));
        }
      }
    },
    [status]
  );

  const handleMoveUp = () => {
    if (onMoveUp) {
      onMoveUp(notification.id);
    }
  };

  const handleMoveDown = () => {
    if (onMoveDown) {
      onMoveDown(notification.id);
    }
  };

  const renderIcon = (): React.ReactNode => {
    if (validType(type)) {
      return (
        <Icon
          src={icons[type]}
          className="flex-none text-primary-600 dark:text-primary-400"
        />
      );
    } else {
      return null;
    }
  };

  const renderContent = () => {
    switch (type as NotificationType) {
      case "follow":
      case "user_approved":
        return account && typeof account === "object" ? (
          <AccountContainer
            id={account.id}
            hidden={hidden}
            avatarSize={avatarSize}
            withRelationship
          />
        ) : null;
      case "follow_request":
        return account && typeof account === "object" ? (
          <AccountContainer
            id={account.id}
            hidden={hidden}
            avatarSize={avatarSize}
            actionType="follow_request"
            withRelationship
          />
        ) : null;
      case "move":
        return account &&
          typeof account === "object" &&
          notification.target &&
          typeof notification.target === "object" ? (
          <AccountContainer
            id={notification.target.id}
            hidden={hidden}
            avatarSize={avatarSize}
            withRelationship
          />
        ) : null;
      case "like":
      case "group_like":
      case "mention":
      case "repost":
      case "group_repost":
      case "status":
      case "poll":
      case "update":
        return status && typeof status === "object" ? (
          <StatusContainer
            id={status.id}
            hidden={hidden}
            onMoveDown={handleMoveDown}
            onMoveUp={handleMoveUp}
            avatarSize={avatarSize}
            contextType="notifications"
            showGroup={false}
          />
        ) : null;
      default:
        return null;
    }
  };

  const targetName =
    notification.target && typeof notification.target === "object"
      ? notification.target.id
      : "";

  const message: React.ReactNode =
    validType(type) && account && typeof account === "object"
      ? buildMessage(
        intl,
        type,
        account,
        notification.total_count,
        targetName,
        "Apollo"
      )
      : null;

  const ariaLabel = validType(type)
    ? notificationForScreenReader(
      intl,
      intl.formatMessage(messages[type], {
        name: account && typeof account === "object" ? account.id : "",
        targetName,
      }),
      notification.created_at
    )
    : "";

  return (
    <HotKeys handlers={getHandlers()} data-testid="notification">
      <div
        className="notification focusable"
        tabIndex={0}
        aria-label={ariaLabel}
      >
        <div className="focusable p-4">
          <div className="mb-2">
            <HStack alignItems="center" space={3}>
              <div
                className="flex justify-end"
                style={{ flexBasis: avatarSize }}
              >
                {renderIcon()}
              </div>

              <div className="truncate">
                <Text theme="muted" size="xs" truncate data-testid="message">
                  {message}
                </Text>
              </div>
            </HStack>
          </div>

          <div>{renderContent()}</div>
        </div>
      </div>
    </HotKeys>
  );
};

export default Notification;

import atIcon from "@tabler/icons/outline/at.svg";
import bellRingingIcon from "@tabler/icons/outline/bell-ringing.svg";
import chartBarIcon from "@tabler/icons/outline/chart-bar.svg";
import heartIcon from "@tabler/icons/outline/heart.svg";
import moodSmileIcon from "@tabler/icons/outline/mood-smile.svg";
import repeatIcon from "@tabler/icons/outline/repeat.svg";
import userPlusIcon from "@tabler/icons/outline/user-plus.svg";
import { defineMessages, useIntl } from "react-intl";

import { setFilter } from "src/actions/notifications";
import Icon from "src/components/Icon";
import Tabs from "src/components/Tabs";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useSettings } from "src/hooks/useSettings";

import type { Item } from "src/components/Tabs";

const messages = defineMessages({
  all: { id: "notifications.filter.all", defaultMessage: "All" },
  mentions: { id: "notifications.filter.mentions", defaultMessage: "Mentions" },
  likes: {
    id: "notifications.filter.likes",
    defaultMessage: "Likes",
  },
  boosts: { id: "notifications.filter.boosts", defaultMessage: "Reposts" },
  polls: { id: "notifications.filter.polls", defaultMessage: "Poll results" },
  follows: { id: "notifications.filter.follows", defaultMessage: "Follows" },
  emoji_reacts: {
    id: "notifications.filter.emoji_reacts",
    defaultMessage: "Emoji reacts",
  },
  statuses: {
    id: "notifications.filter.statuses",
    defaultMessage: "Updates from people you follow",
  },
});

const NotificationFilterBar = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settings = useSettings();

  const selectedFilter = settings.notifications.quickFilter.active;
  const advancedMode = settings.notifications.quickFilter.advanced;

  const onClick = (notificationType: string) => () =>
    dispatch(setFilter(notificationType));

  const items: Item[] = [
    {
      text: intl.formatMessage(messages.all),
      action: onClick("all"),
      name: "all",
    },
  ];

  if (!advancedMode) {
    items.push({
      text: intl.formatMessage(messages.mentions),
      action: onClick("mention"),
      name: "mention",
    });
  } else {
    items.push({
      text: <Icon src={atIcon} />,
      title: intl.formatMessage(messages.mentions),
      action: onClick("mention"),
      name: "mention",
    });
    items.push({
      text: <Icon src={heartIcon} />,
      title: intl.formatMessage(messages.likes),
      action: onClick("like"),
      name: "like",
    });
    items.push({
      text: <Icon src={repeatIcon} />,
      title: intl.formatMessage(messages.boosts),
      action: onClick("repost"),
      name: "repost",
    });
    items.push({
      text: <Icon src={chartBarIcon} />,
      title: intl.formatMessage(messages.polls),
      action: onClick("poll"),
      name: "poll",
    });
    items.push({
      text: <Icon src={bellRingingIcon} />,
      title: intl.formatMessage(messages.statuses),
      action: onClick("status"),
      name: "status",
    });
    items.push({
      text: <Icon src={userPlusIcon} />,
      title: intl.formatMessage(messages.follows),
      action: onClick("follow"),
      name: "follow",
    });
  }

  return <Tabs items={items} activeItem={selectedFilter} />;
};

export default NotificationFilterBar;

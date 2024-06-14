import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { setFilter } from 'src/actions/notifications';
import { Icon, Item, Tabs } from 'src/components';
import { useAppDispatch, useSettings } from 'src/hooks';

const messages = defineMessages({
  all: { id: 'notifications.filter.all', defaultMessage: 'All' },
  mentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
  favourites: { id: 'notifications.filter.favourites', defaultMessage: 'Likes' },
  boosts: { id: 'notifications.filter.boosts', defaultMessage: 'Reposts' },
  polls: { id: 'notifications.filter.polls', defaultMessage: 'Poll results' },
  follows: { id: 'notifications.filter.follows', defaultMessage: 'Follows' },
  statuses: { id: 'notifications.filter.statuses', defaultMessage: 'Updates from people you follow' },
});

const NotificationFilterBar = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settings = useSettings();

  const selectedFilter = settings.notifications.quickFilter.active;
  const advancedMode = settings.notifications.quickFilter.advanced;

  const onClick = (notificationType: string) => () => dispatch(setFilter(notificationType));

  const items: Item[] = [
    {
      text: intl.formatMessage(messages.all),
      action: onClick('all'),
      name: 'all',
    },
  ];

  if (!advancedMode) {
    items.push({
      text: intl.formatMessage(messages.mentions),
      action: onClick('mention'),
      name: 'mention',
    });
  } else {
    items.push({
      text: <Icon src={require('@tabler/icons/outline/at.svg')} />,
      title: intl.formatMessage(messages.mentions),
      action: onClick('mention'),
      name: 'mention',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/outline/heart.svg')} />,
      title: intl.formatMessage(messages.favourites),
      action: onClick('favourite'),
      name: 'favourite',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/outline/repeat.svg')} />,
      title: intl.formatMessage(messages.boosts),
      action: onClick('repost'),
      name: 'repost',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/outline/chart-bar.svg')} />,
      title: intl.formatMessage(messages.polls),
      action: onClick('poll'),
      name: 'poll',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/outline/bell-ringing.svg')} />,
      title: intl.formatMessage(messages.statuses),
      action: onClick('status'),
      name: 'status',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/outline/user-plus.svg')} />,
      title: intl.formatMessage(messages.follows),
      action: onClick('follow'),
      name: 'follow',
    });
  }

  return <Tabs items={items} activeItem={selectedFilter} />;
};

export default NotificationFilterBar;
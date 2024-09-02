import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { Stack } from "src/components";
import { useStatContext } from "src/contexts/stat-context";
import ComposeButton from "src/features/ComposeButton";
import {
  useAppSelector,
  useGroupsPath,
  useOwnAccount,
} from "src/hooks";

import DropdownMenu, { Menu } from "./dropdown-menu";
import SidebarNavigationLink from "./SidebarNavigationLink";
import { useSettings } from "src/hooks/useSettings";

const messages = defineMessages({
  follow_requests: {
    id: "navigation_bar.follow_requests",
    defaultMessage: "Follow requests",
  },
  bookmarks: { id: "column.bookmarks", defaultMessage: "Bookmarks" },
  lists: { id: "column.lists", defaultMessage: "Lists" },
  events: { id: "column.events", defaultMessage: "Events" },
  developers: { id: "navigation.developers", defaultMessage: "Developers" },
});

/** Desktop sidebar with links to different views in the app. */
const SidebarNavigation = () => {
  const intl = useIntl();
  const { unreadChatsCount } = useStatContext();

  const { isDeveloper } = useSettings();
  const { account } = useOwnAccount();
  const groupsPath = useGroupsPath();

  const notificationCount = useAppSelector(
    (state) => state.notifications.unread
  );

  const followRequestsCount = useAppSelector((state) =>
    state.user_lists.follow_requests.items.count()
  );
  const dashboardCount = useAppSelector(
    (state) =>
      state.admin.openReports.count() + state.admin.awaitingApproval.count()
  );
  const makeMenu = (): Menu => {
    const menu: Menu = [];

    if (account) {
      if (followRequestsCount > 0) {
        menu.push({
          to: "/follow_requests",
          text: intl.formatMessage(messages.follow_requests),
          icon: require("@tabler/icons/outline/user-plus.svg"),
          count: followRequestsCount,
        });
      }

      menu.push({
        to: "/bookmarks",
        text: intl.formatMessage(messages.bookmarks),
        icon: require("@tabler/icons/outline/bookmark.svg"),
      });

      if (isDeveloper) {
        menu.push({
          to: "/developers",
          icon: require("@tabler/icons/outline/code.svg"),
          text: intl.formatMessage(messages.developers),
        });
      }
    }

    return menu;
  };

  const menu = makeMenu();

  /** Conditionally render the supported messages link */
  const renderMessagesLink = (): React.ReactNode => {
    return (
      <SidebarNavigationLink
        to="/chats"
        icon={require("@tabler/icons/outline/messages.svg")}
        count={unreadChatsCount}
        countMax={9}
        text={<FormattedMessage id="navigation.direct_messages" defaultMessage="Messages" />}
      />
    );

    /*  TODO: Decide if we can get rid of this
    if (features.directTimeline || features.conversations) {
      return (
        <SidebarNavigationLink
          to='/messages'
          icon={require('@tabler/icons/outline/mail.svg')}
          text={<FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />}
        />
      );
    }

    return null;

        */
  };

  return (
    <Stack space={4}>
      <Stack space={2}>
        <SidebarNavigationLink
          to="/"
          icon={require("@tabler/icons/outline/home.svg")}
          activeIcon={require("@tabler/icons/filled/home.svg")}
          text={<FormattedMessage id="tabs_bar.home" defaultMessage="Home" />}
        />

        <SidebarNavigationLink
          to="/search"
          icon={require("@tabler/icons/outline/search.svg")}
          text={
            <FormattedMessage id="tabs_bar.search" defaultMessage="Search" />
          }
        />

        <SidebarNavigationLink
          to="/s"
          icon={require("@tabler/icons/outline/planet.svg")}
          text={<FormattedMessage id="tabs_bar.games" defaultMessage="Spaces" />}
        />

        <SidebarNavigationLink
          to="/esports"
          icon={require("@tabler/icons/outline/device-gamepad-2.svg")}
          text={<FormattedMessage id="tabs_bar.games" defaultMessage="eSports" />}
        />

        {account && (
          <>
            <SidebarNavigationLink
              to="/notifications"
              icon={require("@tabler/icons/outline/bell.svg")}
              activeIcon={require("@tabler/icons/filled/bell.svg")}
              count={notificationCount}
              text={
                <FormattedMessage
                  id="tabs_bar.notifications"
                  defaultMessage="Notifications"
                />
              }
            />

            {
              renderMessagesLink() /* TODO: Maybe just replace with the component defined in the function */
            }

            { /* TODO: Put this back

            <SidebarNavigationLink
              to={groupsPath}
              icon={require("@tabler/icons/outline/circles.svg")}
              activeIcon={require("@tabler/icons/filled/circles.svg")}
              text={
                <FormattedMessage
                  id="tabs_bar.groups"
                  defaultMessage="Groups"
                />
              }
            />
            */ }

            <SidebarNavigationLink
              to={`/@${account.username}`}
              icon={require("@tabler/icons/outline/user.svg")}
              activeIcon={require("@tabler/icons/filled/user.svg")}
              text={
                <FormattedMessage
                  id="tabs_bar.profile"
                  defaultMessage="Profile"
                />
              }
            />

            <SidebarNavigationLink
              to="/settings"
              icon={require("@tabler/icons/outline/settings.svg")}
              activeIcon={require("@tabler/icons/filled/settings.svg")}
              text={
                <FormattedMessage
                  id="tabs_bar.settings"
                  defaultMessage="Settings"
                />
              }
            />

            {account.staff && (
              <SidebarNavigationLink
                to="/apollo/admin"
                icon={require("@tabler/icons/outline/dashboard.svg")}
                count={dashboardCount}
                text={
                  <FormattedMessage
                    id="tabs_bar.dashboard"
                    defaultMessage="Dashboard"
                  />
                }
              />
            )}
          </>
        )}

        {/* (features.publicTimeline) && (  TODO: Refactor public/local timelines so that we can make a FYP 
          <>
            {(account || !restrictUnauth.timelines.local) && (
              <SidebarNavigationLink
                to='/timeline/local'
                icon={features.federating ? require('@tabler/icons/outline/affiliate.svg') : require('@tabler/icons/outline/world.svg')}
                activeIcon={features.federating ? require('@tabler/icons/filled/affiliate.svg') : undefined}
                text={features.federating ? <FormattedMessage id='tabs_bar.local' defaultMessage='Local' /> : <FormattedMessage id='tabs_bar.all' defaultMessage='All' />}
              />
            )}

            {(features.federating && (account || !restrictUnauth.timelines.federated)) && (
              <SidebarNavigationLink
                to='/timeline/fediverse'
                icon={require('@tabler/icons/outline/topology-star-ring-3.svg')}
                text={<FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />}
              />
            )}
          </>
            ) */}

        {menu.length > 0 && (
          <DropdownMenu items={menu} placement="top">
            <SidebarNavigationLink
              icon={require("@tabler/icons/outline/dots-circle-horizontal.svg")}
              text={
                <FormattedMessage id="tabs_bar.more" defaultMessage="More" />
              }
            />
          </DropdownMenu>
        )}
      </Stack>

      {account && <ComposeButton />}
    </Stack>
  );
};

export default SidebarNavigation;

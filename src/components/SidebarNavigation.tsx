import bellFilledIcon from "@tabler/icons/filled/bell.svg";
import circlesFilledIcon from "@tabler/icons/filled/circles.svg";
import homeFilledIcon from "@tabler/icons/filled/home.svg";
import settingsFilledIcon from "@tabler/icons/filled/settings.svg";
import userFilledIcon from "@tabler/icons/filled/user.svg";
import atIcon from "@tabler/icons/outline/at.svg";
import bellIcon from "@tabler/icons/outline/bell.svg";
import bookmarkIcon from "@tabler/icons/outline/bookmark.svg";
import calendarEventIcon from "@tabler/icons/outline/calendar-event.svg";
import circlesIcon from "@tabler/icons/outline/circles.svg";
import codeIcon from "@tabler/icons/outline/code.svg";
import dashboardIcon from "@tabler/icons/outline/dashboard.svg";
import gateIcon from "@tabler/icons/outline/torii.svg";
import plantIcon from "@tabler/icons/outline/plant-2.svg";
import dotsCircleHorizontalIcon from "@tabler/icons/outline/dots-circle-horizontal.svg";
import homeIcon from "@tabler/icons/outline/home.svg";
import listIcon from "@tabler/icons/outline/list.svg";
import mailIcon from "@tabler/icons/outline/mail.svg";
import messagesIcon from "@tabler/icons/outline/messages.svg";
import searchIcon from "@tabler/icons/outline/search.svg";
import settingsIcon from "@tabler/icons/outline/settings.svg";
import userPlusIcon from "@tabler/icons/outline/user-plus.svg";
import userIcon from "@tabler/icons/outline/user.svg";
import worldIcon from "@tabler/icons/outline/world.svg";
import planetIcon from "@tabler/icons/outline/planet.svg";
import d20Icon from "@tabler/icons/outline/ikosaedr.svg";
import controllerIcon from "@tabler/icons/outline/device-gamepad-2.svg";

import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import Stack from "src/components/Stack";
import { useStatContext } from "src/contexts/stat-context";
import ComposeButton from "src/features/ComposeButton";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { useSettings } from "src/hooks/useSettings";

import DropdownMenu, { Menu } from "./dropdown-menu/index";
import SidebarNavigationLink from "./SidebarNavigationLink";

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
      if (account.locked || followRequestsCount > 0) {
        menu.push({
          to: "/follow_requests",
          text: intl.formatMessage(messages.follow_requests),
          icon: userPlusIcon,
          count: followRequestsCount,
        });
      }
      {
        menu.push({
          to: "/bookmarks",
          text: intl.formatMessage(messages.bookmarks),
          icon: bookmarkIcon,
        });
      }

      if (isDeveloper) {
        menu.push({
          to: "/developers",
          icon: codeIcon,
          text: intl.formatMessage(messages.developers),
        });
      }
    }

    return menu;
  };

  const menu = makeMenu();

  /* TODO: Implement chats
  // Conditionally render the supported messages link 
  const renderMessagesLink = (): React.ReactNode => {
    if (features.chats) {
      return (
        <SidebarNavigationLink
          to="/chats"
          icon={messagesIcon}
          count={unreadChatsCount}
          countMax={9}
          text={
            <FormattedMessage id="navigation.chats" defaultMessage="Chats" />
          }
        />
      );
    }

    if (features.directTimeline || features.conversations) {
      return (
        <SidebarNavigationLink
          to="/messages"
          icon={mailIcon}
          text={
            <FormattedMessage
              id="navigation.direct_messages"
              defaultMessage="Messages"
            />
          }
        />
      );
    }

    return null;
  };
  */

  return (
    <Stack space={4}>
      <Stack space={2}>
        <SidebarNavigationLink
          to="/"
          icon={homeIcon}
          activeIcon={homeFilledIcon}
          text={<FormattedMessage id="tabs_bar.home" defaultMessage="Home" />}
        />

        <SidebarNavigationLink
          to="/search"
          icon={searchIcon}
          text={
            <FormattedMessage id="tabs_bar.search" defaultMessage="Discover" />
          }
        />

        <SidebarNavigationLink
          to="/s"
          icon={d20Icon}
          text={
            <FormattedMessage id="tabs_bar.games" defaultMessage="Spaces" />
          }
        />

        <SidebarNavigationLink
          to="/esports"
          icon={controllerIcon}
          text={
            <FormattedMessage id="tabs_bar.games" defaultMessage="Esports" />
          }
        />

        {account && (
          <>
            <SidebarNavigationLink
              to="/notifications"
              icon={bellIcon}
              activeIcon={bellFilledIcon}
              count={notificationCount}
              text={
                <FormattedMessage
                  id="tabs_bar.notifications"
                  defaultMessage="Notifications"
                />
              }
            />

            {/* TODO: Implement renderMessagesLink() */}

            {/* TODO: Implement features.groups && (
              <SidebarNavigationLink
                to="/groups"
                icon={circlesIcon}
                activeIcon={circlesFilledIcon}
                text={
                  <FormattedMessage
                    id="tabs_bar.groups"
                    defaultMessage="Groups"
                  />
                }
              />
            ) */}

            <SidebarNavigationLink
              to={`/@${account.username}`}
              icon={userIcon}
              activeIcon={userFilledIcon}
              text={
                <FormattedMessage
                  id="tabs_bar.profile"
                  defaultMessage="Profile"
                />
              }
            />

            <SidebarNavigationLink
              to="/settings"
              icon={settingsIcon}
              activeIcon={settingsFilledIcon}
              text={
                <FormattedMessage
                  id="tabs_bar.settings"
                  defaultMessage="Settings"
                />
              }
            />

            {account.staff && (
              <SidebarNavigationLink
                to="/admin"
                icon={planetIcon}
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

        {/* TODO: Maybe implement features.publicTimeline && (
          <>
            {(account || !restrictUnauth.timelines.local) && (
              <SidebarNavigationLink
                to="/timeline/local"
                icon={features.federating ? atIcon : worldIcon}
                text={
                  features.federating ? (
                    instance.domain
                  ) : (
                    <FormattedMessage
                      id="tabs_bar.global"
                      defaultMessage="Global"
                    />
                  )
                }
              />
            )}
          </>
        ) */}

        {menu.length > 0 && (
          <DropdownMenu items={menu} placement="top">
            <SidebarNavigationLink
              icon={dotsCircleHorizontalIcon}
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

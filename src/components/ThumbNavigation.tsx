import React from "react";
import { FormattedMessage } from "react-intl";

import ThumbNavigationLink from "src/components/ThumbNavigationLink";
import { useStatContext } from "src/contexts/stat-context";
import { useAppSelector, useGroupsPath, useOwnAccount } from "src/hooks";

const ThumbNavigation: React.FC = (): JSX.Element => {
  const { account } = useOwnAccount();
  const groupsPath = useGroupsPath();

  const { unreadChatsCount } = useStatContext();

  const notificationCount = useAppSelector(
    (state) => state.notifications.unread
  );
  const dashboardCount = useAppSelector(
    (state) =>
      state.admin.openReports.count() + state.admin.awaitingApproval.count()
  );
  /** Conditionally render the supported messages link */
  const renderMessagesLink = (): React.ReactNode => {
    return (
      <ThumbNavigationLink
        src={require("@tabler/icons/outline/messages.svg")}
        text={<FormattedMessage id="navigation.chats" defaultMessage="Chats" />}
        to="/chats"
        exact
        count={unreadChatsCount}
        countMax={9}
      />
    );

    /*   TODO: Decide if this needs to be removed, like SidebarNavigation
    if (features.directTimeline || features.conversations) {
      return (
        <ThumbNavigationLink
          src={require('@tabler/icons/outline/mail.svg')}
          activeSrc={require('@tabler/icons/filled/mail.svg')}
          text={<FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />}
          to='/messages'
          paths={['/messages', '/conversations']}
        />
      );
    }

    return null;

    */
  };

  return (
    <div className="thumb-navigation">
      <ThumbNavigationLink
        src={require("@tabler/icons/outline/home.svg")}
        activeSrc={require("@tabler/icons/filled/home.svg")}
        text={<FormattedMessage id="navigation.home" defaultMessage="Home" />}
        to="/"
        exact
      />
      {/* TODO: IMPLEMENT

        <ThumbNavigationLink
          src={require('@tabler/icons/outline/circles.svg')}
          activeSrc={require('@tabler/icons/filled/circles.svg')}
          text={<FormattedMessage id='tabs_bar.groups' defaultMessage='Groups' />}
          to={groupsPath}
          exact
        />

 */}

      <ThumbNavigationLink
        src={require("@tabler/icons/outline/search.svg")}
        text={
          <FormattedMessage id="navigation.search" defaultMessage="Search" />
        }
        to="/search"
        exact
      />

      {account && (
        <ThumbNavigationLink
          src={require("@tabler/icons/outline/bell.svg")}
          activeSrc={require("@tabler/icons/filled/bell.svg")}
          text={
            <FormattedMessage
              id="navigation.notifications"
              defaultMessage="Notifications"
            />
          }
          to="/notifications"
          exact
          count={notificationCount}
        />
      )}

      {/* TODO: Put back in account && renderMessagesLink() */}

      {account && account.staff && (
        <ThumbNavigationLink
          src={require("@tabler/icons/outline/dashboard.svg")}
          text={
            <FormattedMessage
              id="navigation.dashboard"
              defaultMessage="Dashboard"
            />
          }
          to="/apollo/admin"
          count={dashboardCount}
        />
      )}
    </div>
  );
};

export default ThumbNavigation;

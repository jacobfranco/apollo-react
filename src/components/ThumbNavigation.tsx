import React from 'react';
import { FormattedMessage } from 'react-intl';

import ThumbNavigationLink from 'src/components/ThumbNavigationLink';
import { useStatContext } from 'src/contexts/stat-context';
import { useAppSelector, /* useGroupsPath,*/ useOwnAccount } from 'src/hooks'; //TODO: Implement groups

const ThumbNavigation: React.FC = (): JSX.Element => {
  const { account } = useOwnAccount();
  // const groupsPath = useGroupsPath();

  const { unreadChatsCount } = useStatContext();

  const notificationCount = 0;  // TODO: Dummy init, remove later
  const dashboardCount = 0; // TODO: Dummy init, remove later

  /* TODO: Implement notifications and admin
  const notificationCount = useAppSelector((state) => state.notifications.unread);
  const dashboardCount = useAppSelector((state) => state.admin.openReports.count() + state.admin.awaitingApproval.count());
*/ 
  /** Conditionally render the supported messages link */
  const renderMessagesLink = (): React.ReactNode => {
      return (
        <ThumbNavigationLink
          src={require('@tabler/icons/messages.svg')}
          text={<FormattedMessage id='navigation.chats' defaultMessage='Chats' />}
          to='/chats'
          exact
          count={unreadChatsCount}
          countMax={9}
        />
      );

      /*   TODO: Decide if this needs to be removed, like SidebarNavigation
    if (features.directTimeline || features.conversations) {
      return (
        <ThumbNavigationLink
          src={require('@tabler/icons/mail.svg')}
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
    <div className='thumb-navigation'>
      <ThumbNavigationLink
        src={require('@tabler/icons/home.svg')}
        text={<FormattedMessage id='navigation.home' defaultMessage='Home' />}
        to='/'
        exact
      />

      {/*  TODO: Implement groups
        <ThumbNavigationLink
          src={require('@tabler/icons/circles.svg')}
          text={<FormattedMessage id='tabs_bar.groups' defaultMessage='Groups' />}
          to={groupsPath}
          exact
        />
      */ }

      <ThumbNavigationLink
        src={require('@tabler/icons/search.svg')}
        text={<FormattedMessage id='navigation.search' defaultMessage='Search' />}
        to='/search'
        exact
      />

      {account && (
        <ThumbNavigationLink
          src={require('@tabler/icons/bell.svg')}
          text={<FormattedMessage id='navigation.notifications' defaultMessage='Notifications' />}
          to='/notifications'
          exact
          count={notificationCount}
        />
      )}

      {account && renderMessagesLink()}

      {(account /* TODO: Implement staff && account.staff */) && (
        <ThumbNavigationLink
          src={require('@tabler/icons/dashboard.svg')}
          text={<FormattedMessage id='navigation.dashboard' defaultMessage='Dashboard' />}
          to='/soapbox/admin'
          count={dashboardCount}
        />
      )}
    </div>
  );
};

export default ThumbNavigation;
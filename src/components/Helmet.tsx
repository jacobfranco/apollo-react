import React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

import { useStatContext } from 'src/contexts/stat-context';
import { useAppSelector } from 'src/hooks';
import { useSettings } from 'src/hooks/useSettings';
import { RootState } from 'src/store';
import FaviconService from 'src/utils/favicon-service';

FaviconService.initFaviconService();

const getNotifTotals = (state: RootState): number => {
  const notifications = state.notifications.unread || 0;
  const reports = state.admin.openReports.count();
  const approvals = state.admin.awaitingApproval.count();
  return notifications + reports + approvals;
};

interface IHelmet {
  children: React.ReactNode;
}

const Helmet: React.FC<IHelmet> = ({ children }) => {
  const { unreadChatsCount } = useStatContext();
  const unreadCount = useAppSelector((state) => getNotifTotals(state)); // + unreadChatsCount); TODO: Implement chats
  const { demetricator } = useSettings();

  const hasUnreadNotifications = React.useMemo(() => !(unreadCount < 1 || demetricator), [unreadCount, demetricator]);

  const addCounter = (string: string) => {
    return hasUnreadNotifications ? `(${unreadCount}) ${string}` : string;
  };

  const updateFaviconBadge = () => {
    if (hasUnreadNotifications) {
      FaviconService.drawFaviconBadge();
    } else {
      FaviconService.clearFaviconBadge();
    }
  };

  React.useEffect(() => {
    updateFaviconBadge();
  }, [unreadCount, demetricator]);

  return (
    <ReactHelmet
      titleTemplate={addCounter("%s | Apollo")}
      defaultTitle={addCounter('Apollo')}
      defer={false}
    >
      {children}
    </ReactHelmet>
  );
};

export default Helmet;
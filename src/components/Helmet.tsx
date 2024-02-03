import React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

import { useStatContext } from 'src/contexts/stat-context';
import { useAppSelector, useSettings } from 'src/hooks';
import { RootState } from 'src/store';

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
  const unreadCount = useAppSelector((state) => getNotifTotals(state); // + unreadChatsCount); TODO: Implement chats
  const demetricator = useSettings().get('demetricator');

  const hasUnreadNotifications = React.useMemo(() => !(unreadCount < 1 || demetricator), [unreadCount, demetricator]);

  const addCounter = (string: string) => {
    return hasUnreadNotifications ? `(${unreadCount}) ${string}` : string;
  };

  return (
    <ReactHelmet
      titleTemplate={addCounter(`%s | 'Apollo'}`)}
      defaultTitle={addCounter('Apollo')}
      defer={false}
    >
      {children}
    </ReactHelmet>
  );
};

export default Helmet;
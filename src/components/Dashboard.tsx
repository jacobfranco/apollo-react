import React from "react";
import { FormattedMessage } from "react-intl";
import Stack from "src/components/Stack";
import { DashCounter, DashCounters } from "src/components/DashCounter";
import List, { ListItem } from "src/components/List";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { useInstanceStats } from "src/hooks/useInstanceStats";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { account } = useOwnAccount();
  const {
    userCount,
    statusCount,
    mau,
    retention,
    isLoading = true,
  } = useInstanceStats();

  if (!account) return null;

  return (
    <Stack space={6} className="mt-4">
      <DashCounters>
        <DashCounter
          count={mau}
          isLoading={isLoading}
          label={
            <FormattedMessage
              id="admin.dashcounters.mau_label"
              defaultMessage="monthly active users"
            />
          }
        />
        <DashCounter
          count={userCount}
          isLoading={isLoading}
          label={
            <FormattedMessage
              id="admin.dashcounters.user_count_label"
              defaultMessage="total users"
            />
          }
        />
        <DashCounter
          count={retention}
          isLoading={isLoading}
          label={
            <FormattedMessage
              id="admin.dashcounters.retention_label"
              defaultMessage="user retention"
            />
          }
          percent
        />
        <DashCounter
          count={statusCount}
          isLoading={isLoading}
          label={
            <FormattedMessage
              id="admin.dashcounters.status_count_label"
              defaultMessage="posts"
            />
          }
        />
      </DashCounters>
      <List>
        <ListItem
          to="/admin/users"
          label={
            <FormattedMessage id="column.admin.users" defaultMessage="Users" />
          }
        />
        <ListItem
          to="/admin/reports"
          label={
            <FormattedMessage
              id="column.admin.reports"
              defaultMessage="Reports"
            />
          }
        />
        <ListItem
          to="/admin/log"
          label={
            <FormattedMessage
              id="column.admin.moderation_log"
              defaultMessage="Moderation Log"
            />
          }
        />
        <ListItem
          to="/admin/spaces"
          label={
            <FormattedMessage
              id="column.admin.spaces"
              defaultMessage="Spaces"
            />
          }
        />
      </List>
    </Stack>
  );
};

export default Dashboard;

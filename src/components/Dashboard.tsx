import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import Stack from "src/components/Stack";
import { DashCounter, DashCounters } from "src/components/DashCounter";
import List, { ListItem } from "src/components/List";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { useAppSelector } from "src/hooks/useAppSelector";
import { fetchInstanceStats, fetchInstanceMetrics } from "src/actions/instance";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { account } = useOwnAccount();

  const {
    userCount,
    statusCount,
    mau,
    metrics,
    isLoading = true,
  } = useAppSelector((state) => ({
    userCount: state.instance.get("userCount"),
    statusCount: state.instance.get("statusCount"),
    mau: state.instance.get("mau"),
    metrics: state.instance.get("metrics"),
    isLoading: state.instance.get("isLoading"),
  }));

  const retention = (() => {
    if (!userCount || !mau) return undefined;
    return Math.round((mau / userCount) * 100);
  })();

  useEffect(() => {
    dispatch(fetchInstanceStats());
    dispatch(fetchInstanceMetrics());
  }, [dispatch]);

  if (!account) return null;

  return (
    <Stack space={6} className="mt-4">
      {/* Top row: Current activity metrics */}
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
          count={metrics?.uniqueIPs}
          isLoading={isLoading}
          label={
            <FormattedMessage
              id="admin.dashcounters.unique_visitors_label"
              defaultMessage="Unique visitors/hr"
            />
          }
        />
        <DashCounter
          count={metrics?.requests}
          isLoading={isLoading}
          label={
            <FormattedMessage
              id="admin.dashcounters.requests_label"
              defaultMessage="API requests/hr"
            />
          }
        />
      </DashCounters>

      {/* Bottom row: Overall stats */}
      <DashCounters>
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
          count={statusCount}
          isLoading={isLoading}
          label={
            <FormattedMessage
              id="admin.dashcounters.status_count_label"
              defaultMessage="total posts"
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

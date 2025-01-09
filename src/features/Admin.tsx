import React from "react";

import { defineMessages, useIntl } from "react-intl";
import { Switch, Route } from "react-router-dom";

import { Column } from "src/components/Column";
import { useOwnAccount } from "src/hooks/useOwnAccount";

import Dashboard from "src/components/Dashboard";

const messages = defineMessages({
  heading: { id: "column.admin.dashboard", defaultMessage: "Dashboard" },
});

const Admin: React.FC = () => {
  const intl = useIntl();
  const { account } = useOwnAccount();

  if (!account) return null;

  return (
    <Column label={intl.formatMessage(messages.heading)} withHeader={false}>
      <Dashboard></Dashboard>
    </Column>
  );
};

export default Admin;

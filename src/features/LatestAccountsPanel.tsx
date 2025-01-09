import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import { useAdminAccounts } from "src/api/hooks/useAdminAccounts";
import Account from "src/components/Account";
import Widget from "src/components/Widget";

const messages = defineMessages({
  title: {
    id: "admin.latest_accounts_panel.title",
    defaultMessage: "Latest Accounts",
  },
});

interface ILatestAccountsPanel {
  limit?: number;
}

const LatestAccountsPanel: React.FC<ILatestAccountsPanel> = ({ limit = 5 }) => {
  const intl = useIntl();
  const history = useHistory();

  const { accounts } = useAdminAccounts({}, limit);

  const handleAction = () => {
    history.push("/admin/users");
  };

  return (
    <Widget
      title={intl.formatMessage(messages.title)}
      onActionClick={handleAction}
    >
      {accounts.slice(0, limit).map((account) => (
        <Account
          key={account.id}
          account={account}
          withRelationship={false}
          withDate
        />
      ))}
    </Widget>
  );
};

export default LatestAccountsPanel;

import { defineMessages, useIntl } from "react-intl";
import React from "react";
import { useAdminAccounts } from "src/api/hooks/useAdminAccounts";
import Account from "src/components/Account";
import ScrollableList from "src/components/ScrollableList";
import { Column } from "src/components/Column";

const messages = defineMessages({
  heading: { id: "column.admin.users", defaultMessage: "Users" },
  empty: { id: "admin.user_index.empty", defaultMessage: "No users found." },
  searchPlaceholder: {
    id: "admin.user_index.search_input_placeholder",
    defaultMessage: "Who are you looking for?",
  },
});

const UserIndex: React.FC = () => {
  const intl = useIntl();

  const { accounts, isLoading, hasNextPage, fetchNextPage } = useAdminAccounts(
    {}
  );

  const handleLoadMore = () => {
    if (!isLoading) {
      fetchNextPage();
    }
  };

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey="user-index"
        hasMore={hasNextPage}
        isLoading={isLoading}
        showLoading={isLoading}
        onLoadMore={handleLoadMore}
        emptyMessage={intl.formatMessage(messages.empty)}
        className="mt-4"
        itemClassName="pb-4"
      >
        {accounts.map((account) => {
          return <Account key={account.id} account={account} withDate />;
        })}
      </ScrollableList>
    </Column>
  );
};

export default UserIndex;

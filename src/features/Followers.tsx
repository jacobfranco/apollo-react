import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { useFollowers } from "src/api/hooks/useAccountList";
import { useAccountLookup } from "src/api/hooks/useAccountLookup";
import {
  Account,
  MissingIndicator,
  ScrollableList,
  Spinner,
} from "src/components";
import { Column } from "src/components/Column";

const messages = defineMessages({
  heading: { id: "column.followers", defaultMessage: "Followers" },
});

interface IFollowers {
  params?: {
    username?: string;
  };
}

/** Displays a list of accounts who follow the given account. */
const Followers: React.FC<IFollowers> = ({ params }) => {
  const intl = useIntl();

  const { account, isUnavailable } = useAccountLookup(params?.username);

  const { accounts, hasNextPage, fetchNextPage, isLoading } = useFollowers(
    account?.id
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (!account) {
    return <MissingIndicator />;
  }

  if (isUnavailable) {
    return (
      <div className="empty-column-indicator">
        <FormattedMessage
          id="empty_column.account_unavailable"
          defaultMessage="Profile unavailable"
        />
      </div>
    );
  }

  return (
    <Column label={intl.formatMessage(messages.heading)} transparent>
      <ScrollableList
        scrollKey="followers"
        hasMore={hasNextPage}
        onLoadMore={fetchNextPage}
        emptyMessage={
          <FormattedMessage
            id="account.followers.empty"
            defaultMessage="No one follows this user yet."
          />
        }
        itemClassName="pb-4"
      >
        {accounts.map((account) => (
          <Account key={account.id} account={account} />
        ))}
      </ScrollableList>
    </Column>
  );
};

export default Followers;

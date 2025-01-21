import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { useMutes } from "src/api/hooks/useAccountList";
import { Account, ScrollableList, Spinner } from "src/components";
import { Column } from "src/components/Column";

const messages = defineMessages({
  heading: { id: "column.mutes", defaultMessage: "Mutes" },
});

const Mutes: React.FC = () => {
  const intl = useIntl();
  const { accounts, hasNextPage, fetchNextPage, isLoading } = useMutes();

  if (isLoading) {
    return (
      <Column>
        <Spinner />
      </Column>
    );
  }

  const emptyMessage = (
    <FormattedMessage
      id="empty_column.mutes"
      defaultMessage="You haven't muted any users yet."
    />
  );

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey="mutes"
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        emptyMessage={emptyMessage}
        emptyMessageCard={false}
        itemClassName="pb-4 last:pb-0"
      >
        {accounts.map((account) => (
          <Account key={account.id} account={account} actionType="muting" />
        ))}
      </ScrollableList>
    </Column>
  );
};

export default Mutes;

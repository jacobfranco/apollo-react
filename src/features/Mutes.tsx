import React, { useState } from "react";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";

import { useGroupMutes } from "src/api/hooks/useGroupMutes";
import { useMutes } from "src/api/hooks/useAccountList";
import { MuteGroupListItem, ScrollableList, Stack, Tabs } from "src/components";
import { Column } from "src/components/Column";
import AccountContainer from "src/containers/AccountContainer";

const messages = defineMessages({
  heading: { id: "column.mutes", defaultMessage: "Mutes" },
});

enum TabItems {
  ACCOUNTS = "ACCOUNTS",
  GROUPS = "GROUPS",
}

const Mutes: React.FC = () => {
  const intl = useIntl();

  const {
    accounts,
    hasNextPage: hasNextAccountsPage,
    fetchNextPage: fetchNextAccounts,
    isLoading: isLoadingAccounts,
  } = useMutes();

  const {
    mutes: groupMutes,
    isLoading: isLoadingGroups,
    hasNextPage: hasNextGroupsPage,
    fetchNextPage: fetchNextGroups,
    fetchEntities: fetchMutedGroups,
  } = useGroupMutes();

  const [activeItem, setActiveItem] = useState<TabItems>(TabItems.ACCOUNTS);
  const isAccountsTabSelected = activeItem === TabItems.ACCOUNTS;

  const scrollableListProps = {
    itemClassName: "pb-4 last:pb-0",
    scrollKey: "mutes",
    emptyMessageCard: false,
  };

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <Stack space={4}>
        <Tabs
          items={[
            {
              text: "Users",
              action: () => setActiveItem(TabItems.ACCOUNTS),
              name: TabItems.ACCOUNTS,
            },
            {
              text: "Groups",
              action: () => setActiveItem(TabItems.GROUPS),
              name: TabItems.GROUPS,
            },
          ]}
          activeItem={activeItem}
        />

        {isAccountsTabSelected ? (
          <ScrollableList
            {...scrollableListProps}
            isLoading={isLoadingAccounts}
            onLoadMore={fetchNextAccounts}
            hasMore={hasNextAccountsPage}
            emptyMessage={
              <FormattedMessage
                id="empty_column.mutes"
                defaultMessage="You haven't muted any users yet."
              />
            }
          >
            {accounts.map((accounts) => (
              <AccountContainer
                key={accounts.id}
                id={accounts.id}
                actionType="muting"
              />
            ))}
          </ScrollableList>
        ) : (
          <ScrollableList
            {...scrollableListProps}
            isLoading={isLoadingGroups}
            onLoadMore={fetchNextGroups}
            hasMore={hasNextGroupsPage}
            emptyMessage={
              <FormattedMessage
                id="mutes.empty.groups"
                defaultMessage="You haven't muted any groups yet."
              />
            }
          >
            {groupMutes.map((group) => (
              <MuteGroupListItem group={group} onUnmute={fetchMutedGroups} />
            ))}
          </ScrollableList>
        )}
      </Stack>
    </Column>
  );
};

export default Mutes;

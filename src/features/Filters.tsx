import { useEffect } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import { fetchFilters, deleteFilter } from "src/actions/filters";
import RelativeTimestamp from "src/components/RelativeTimestamp";
import ScrollableList from "src/components/ScrollableList";
import Button from "src/components/Button";
import { Column } from "src/components/Column";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import toast from "src/toast";

const messages = defineMessages({
  heading: { id: "column.filters", defaultMessage: "Filters" },
  home_timeline: {
    id: "column.filters.home_timeline",
    defaultMessage: "Home timeline",
  },
  notifications: {
    id: "column.filters.notifications",
    defaultMessage: "Notifications",
  },
  conversations: {
    id: "column.filters.conversations",
    defaultMessage: "Conversations",
  },
  accounts: { id: "column.filters.accounts", defaultMessage: "Accounts" },
  delete_error: {
    id: "column.filters.delete_error",
    defaultMessage: "Error deleting filter",
  },
  edit: { id: "column.filters.edit", defaultMessage: "Edit Filter" },
  delete: { id: "column.filters.delete", defaultMessage: "Delete" },
});

const contexts = {
  home: messages.home_timeline,
  notifications: messages.notifications,
  thread: messages.conversations,
  account: messages.accounts,
};

const Filters = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const filters = useAppSelector((state) => state.filters);

  const handleFilterEdit = (id: string) => () => history.push(`/filters/${id}`);

  const handleFilterDelete = (id: string) => () => {
    dispatch(deleteFilter(id))
      .then(() => {
        return dispatch(fetchFilters());
      })
      .catch(() => {
        toast.error(intl.formatMessage(messages.delete_error));
      });
  };

  useEffect(() => {
    dispatch(fetchFilters());
  }, []);

  const emptyMessage = (
    <FormattedMessage
      id="empty_column.filters"
      defaultMessage="You haven't created any muted words yet."
    />
  );

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <HStack className="mb-4" space={2} justifyContent="end">
        <Button to="/filters/new" theme="primary" size="sm">
          <FormattedMessage
            id="filters.create_filter"
            defaultMessage="Create filter"
          />
        </Button>
      </HStack>

      <ScrollableList
        scrollKey="filters"
        emptyMessage={emptyMessage}
        itemClassName="pb-4 last:pb-0"
      >
        {filters.map((filter) => {
          const truthMessageFilter =
            filter.filter_action === "hide" ? (
              <FormattedMessage
                id="filters.filters_list_hide_completely"
                defaultMessage="Hide content"
              />
            ) : (
              <FormattedMessage
                id="filters.filters_list_warn"
                defaultMessage="Display warning"
              />
            );

          return (
            <div
              key={filter.id}
              className="rounded-lg bg-primary-300/30 p-4 dark:bg-secondary-700/30 shadow-lg"
            >
              <Stack space={2}>
                <Stack className="grow" space={1}>
                  <Text weight="medium">
                    <FormattedMessage
                      id="filters.filters_list_phrases_label"
                      defaultMessage="Words:"
                    />{" "}
                    {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                    <Text theme="muted" tag="span">
                      {filter.keywords
                        .map((keyword) => keyword.keyword)
                        .join(", ")}
                    </Text>
                  </Text>
                  <Text weight="medium">
                    <FormattedMessage
                      id="filters.filters_list_context_label"
                      defaultMessage="Filter contexts:"
                    />{" "}
                    {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                    <Text theme="muted" tag="span">
                      {filter.context
                        .map((context) =>
                          contexts[context]
                            ? intl.formatMessage(contexts[context])
                            : context
                        )
                        .join(", ")}
                    </Text>
                  </Text>
                  <HStack space={4} wrap>
                    <Text weight="medium">{truthMessageFilter}</Text>
                    {filter.expires_at && (
                      <Text weight="medium">
                        {new Date(filter.expires_at).getTime() <= Date.now() ? (
                          <FormattedMessage
                            id="filters.filters_list_expired"
                            defaultMessage="Expired"
                          />
                        ) : (
                          <RelativeTimestamp
                            timestamp={filter.expires_at}
                            className="whitespace-nowrap"
                            futureDate
                          />
                        )}
                      </Text>
                    )}
                  </HStack>
                </Stack>
                <HStack space={2} justifyContent="end">
                  <Button theme="primary" onClick={handleFilterEdit(filter.id)}>
                    {intl.formatMessage(messages.edit)}
                  </Button>
                  <Button
                    theme="danger"
                    onClick={handleFilterDelete(filter.id)}
                  >
                    {intl.formatMessage(messages.delete)}
                  </Button>
                </HStack>
              </Stack>
            </div>
          );
        })}
      </ScrollableList>
    </Column>
  );
};

export default Filters;

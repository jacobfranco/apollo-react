import xIcon from "@tabler/icons/outline/x.svg";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import Text from "src/components/Text";
import Widget from "src/components/Widget";
import AccountContainer from "src/containers/AccountContainer";
import PlaceholderSidebarSuggestions from "src/components/PlaceholderSidebarSuggestions";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { useDismissSuggestion, useSuggestions } from "src/queries/suggestions";

import type { Account as AccountEntity } from "src/types/entities";

const messages = defineMessages({
  dismissSuggestion: {
    id: "suggestions.dismiss",
    defaultMessage: "Dismiss suggestion",
  },
});

interface IWhoToFollowPanel {
  limit: number;
}

const WhoToFollowPanel = ({ limit }: IWhoToFollowPanel) => {
  const intl = useIntl();

  const { account } = useOwnAccount();
  const { data: suggestions, isFetching } = useSuggestions();
  const dismissSuggestion = useDismissSuggestion();

  const suggestionsToRender = suggestions.slice(0, limit);

  const handleDismiss = (account: AccountEntity) => {
    dismissSuggestion.mutate(account.id);
  };

  if (!isFetching && !suggestions.length) {
    return null;
  }

  return (
    <Widget
      title={
        <FormattedMessage
          id="who_to_follow.title"
          defaultMessage="People To Follow"
        />
      }
      action={
        <Link className="text-right" to="/suggestions">
          <Text
            tag="span"
            theme="primary"
            size="sm"
            className="hover:underline"
          >
            <FormattedMessage
              id="feed_suggestions.view_all"
              defaultMessage="View all"
            />
          </Text>
        </Link>
      }
    >
      {isFetching ? (
        <PlaceholderSidebarSuggestions limit={limit} />
      ) : (
        suggestionsToRender.map((suggestion: any) => (
          <AccountContainer
            key={suggestion.account}
            // @ts-ignore: TS thinks `id` is passed to <Account>, but it isn't
            id={suggestion.account}
            actionIcon={xIcon}
            actionTitle={intl.formatMessage(messages.dismissSuggestion)}
            onActionClick={account ? handleDismiss : undefined}
          />
        ))
      )}
    </Widget>
  );
};

export default WhoToFollowPanel;

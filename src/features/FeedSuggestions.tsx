import { defineMessages, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { useAccount } from "src/api/hooks/index";
import { Card, CardBody, CardTitle } from "src/components/Card";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import VerificationBadge from "src/components/VerificationBadge";
import { useAppSelector } from "src/hooks/useAppSelector";

import ActionButton from "src/components/ActionButton";
import { HotKeys } from "src/features/Hotkeys";

const messages = defineMessages({
  heading: {
    id: "feed_suggestions.heading",
    defaultMessage: "Suggested Profiles",
  },
  viewAll: { id: "feed_suggestions.view_all", defaultMessage: "View all" },
});

interface ISuggestionItem {
  accountId: string;
}

const SuggestionItem: React.FC<ISuggestionItem> = ({ accountId }) => {
  const { account } = useAccount(accountId);
  if (!account) return null;

  return (
    <Stack
      space={3}
      className="w-52 shrink-0 rounded-md border border-solid border-gray-300 p-4 dark:border-gray-800 md:w-full md:shrink md:border-transparent md:p-0 dark:md:border-transparent"
    >
      <Link to={`/@${account.username}`} title={account.username}>
        <Stack space={3} className="mx-auto w-40 md:w-24">
          <img
            src={account.avatar}
            className="mx-auto block size-16 min-w-[56px] rounded-5px object-cover"
            alt={account.username}
          />

          <Stack>
            <HStack alignItems="center" justifyContent="center" space={1}>
              <Text
                weight="semibold"
                truncate
                align="center"
                size="sm"
                className="max-w-[95%]"
              >
                {account.display_name}
              </Text>

              {account.verified && <VerificationBadge />}
            </HStack>
            <Text theme="muted" align="center" size="sm" truncate>
              @{account.username}
            </Text>{" "}
            {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
          </Stack>
        </Stack>
      </Link>

      <div className="text-center">
        <ActionButton account={account} />
      </div>
    </Stack>
  );
};

interface IFeedSuggesetions {
  statusId: string;
  onMoveUp?: (statusId: string, featured?: boolean) => void;
  onMoveDown?: (statusId: string, featured?: boolean) => void;
}

const FeedSuggestions: React.FC<IFeedSuggesetions> = ({
  statusId,
  onMoveUp,
  onMoveDown,
}) => {
  const intl = useIntl();
  const suggestedProfiles = useAppSelector((state) => state.suggestions.items);
  const isLoading = useAppSelector((state) => state.suggestions.isLoading);

  if (!isLoading && suggestedProfiles.size === 0) return null;

  const handleHotkeyMoveUp = (e?: KeyboardEvent): void => {
    if (onMoveUp) {
      onMoveUp(statusId);
    }
  };

  const handleHotkeyMoveDown = (e?: KeyboardEvent): void => {
    if (onMoveDown) {
      onMoveDown(statusId);
    }
  };

  const handlers = {
    moveUp: handleHotkeyMoveUp,
    moveDown: handleHotkeyMoveDown,
  };

  return (
    <HotKeys handlers={handlers}>
      <Card
        size="lg"
        variant="rounded"
        className="focusable space-y-6"
        tabIndex={0}
      >
        <HStack justifyContent="between" alignItems="center">
          <CardTitle title={intl.formatMessage(messages.heading)} />

          <Link
            to="/suggestions"
            className="text-primary-600 hover:underline dark:text-accent-blue"
          >
            {intl.formatMessage(messages.viewAll)}
          </Link>
        </HStack>

        <CardBody>
          <HStack
            space={4}
            alignItems="center"
            className="overflow-x-auto md:space-x-0 lg:overflow-x-hidden"
          >
            {suggestedProfiles.slice(0, 4).map((suggestedProfile) => (
              <SuggestionItem
                key={suggestedProfile.account}
                accountId={suggestedProfile.account}
              />
            ))}
          </HStack>
        </CardBody>
      </Card>
    </HotKeys>
  );
};

export default FeedSuggestions;

import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { useAccount } from "src/api/hooks";
import StillImage from "src/components/StillImage";
import Avatar from "src/components/Avatar";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import VerificationBadge from "src/components/VerificationBadge";
import { useAppSelector } from "src/hooks/useAppSelector";
import { shortNumberFormat } from "src/utils/numbers";

interface IUserPanel {
  accountId: string;
  action?: JSX.Element;
  badges?: JSX.Element[];
  domain?: string;
}

const UserPanel: React.FC<IUserPanel> = ({ accountId, action, badges }) => {
  const intl = useIntl();
  const { account } = useAccount(accountId);

  if (!account) return null;
  const username = account.username;
  const header = account.header;
  const verified = account.verified;

  return (
    <div className="relative">
      <Stack space={2}>
        <Stack>
          <div className="relative -mx-4 -mt-4 h-24 overflow-hidden bg-gray-200">
            {header && <StillImage src={account.header} />}
          </div>

          <HStack justifyContent="between">
            <Link
              to={`/@${account.username}`}
              title={username}
              className="-mt-12 block"
            >
              <Avatar
                src={account.avatar}
                size={80}
                className="size-20 overflow-hidden bg-gray-50 ring-2 ring-white"
              />
            </Link>

            {action && <div className="mt-2">{action}</div>}
          </HStack>
        </Stack>

        <Stack>
          <Link to={`/@${account.username}`}>
            <HStack space={1} alignItems="center">
              <Text size="lg" weight="bold" truncate>
                {account.display_name}
              </Text>

              {verified && <VerificationBadge />}

              {badges && badges.length > 0 && (
                <HStack space={1} alignItems="center">
                  {badges}
                </HStack>
              )}
            </HStack>
          </Link>

          <HStack>
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            <Text size="sm" theme="muted" direction="ltr" truncate>
              {/* TODO: Maybe take out these brackets, idk how it will render*/}
              @{username}
            </Text>
          </HStack>
        </Stack>

        <HStack alignItems="center" space={3}>
          {account.followers_count >= 0 && (
            <Link
              to={`/@${account.username}/followers`}
              title={intl.formatNumber(account.followers_count)}
            >
              <HStack alignItems="center" space={1}>
                <Text theme="primary" weight="bold" size="sm">
                  {shortNumberFormat(account.followers_count)}
                </Text>
                <Text weight="bold" size="sm">
                  <FormattedMessage
                    id="account.followers"
                    defaultMessage="Followers"
                  />
                </Text>
              </HStack>
            </Link>
          )}

          {account.following_count >= 0 && (
            <Link
              to={`/@${account.username}/following`}
              title={intl.formatNumber(account.following_count)}
            >
              <HStack alignItems="center" space={1}>
                <Text theme="primary" weight="bold" size="sm">
                  {shortNumberFormat(account.following_count)}
                </Text>
                <Text weight="bold" size="sm">
                  <FormattedMessage
                    id="account.follows"
                    defaultMessage="Following"
                  />
                </Text>
              </HStack>
            </Link>
          )}
        </HStack>
      </Stack>
    </div>
  );
};

export default UserPanel;

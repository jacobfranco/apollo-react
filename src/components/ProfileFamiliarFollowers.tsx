import { OrderedSet as ImmutableOrderedSet } from "immutable";
import { useEffect } from "react";
import { FormattedList, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { fetchAccountFamiliarFollowers } from "src/actions/familiar-followers";
import { openModal } from "src/actions/modals";
import AvatarStack from "src/components/AvatarStack";
import HoverRefWrapper from "src/components/HoverRefWrapper";
import HStack from "src/components/HStack";
import Text from "src/components/Text";
import VerificationBadge from "src/components/VerificationBadge";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { makeGetAccount } from "src/selectors/index";

import type { Account } from "src/schemas/index";

const getAccount = makeGetAccount();

interface IProfileFamiliarFollowers {
  account: Account;
}

const ProfileFamiliarFollowers: React.FC<IProfileFamiliarFollowers> = ({
  account,
}) => {
  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.me);
  const familiarFollowerIds = useAppSelector(
    (state) =>
      state.user_lists.familiar_followers.get(account.id)?.items ||
      ImmutableOrderedSet<string>()
  );
  const familiarFollowers: ImmutableOrderedSet<Account | null> = useAppSelector(
    (state) =>
      familiarFollowerIds
        .slice(0, 2)
        .map((accountId) => getAccount(state, accountId))
  );

  useEffect(() => {
    if (me) {
      dispatch(fetchAccountFamiliarFollowers(account.id));
    }
  }, [account.id]);

  const openFamiliarFollowersModal = () => {
    dispatch(
      openModal("FAMILIAR_FOLLOWERS", {
        accountId: account.id,
      })
    );
  };

  if (familiarFollowerIds.size === 0) {
    return null;
  }

  const accounts: Array<React.ReactNode> = familiarFollowers
    .map(
      (account) =>
        !!account && (
          <HoverRefWrapper accountId={account.id} key={account.id} inline>
            <Link
              className="inline-block text-primary-600 hover:underline dark:text-accent-blue"
              to={`/@${account.username}`}
            >
              <HStack space={1} alignItems="center" grow>
                <Text size="sm" theme="primary" truncate>
                  {account.display_name}
                </Text>

                {account.verified && <VerificationBadge />}
              </HStack>
            </Link>
          </HoverRefWrapper>
        )
    )
    .toArray()
    .filter(Boolean);

  if (familiarFollowerIds.size > 2) {
    accounts.push(
      <span
        key="_"
        className="cursor-pointer hover:underline"
        role="presentation"
        onClick={openFamiliarFollowersModal}
      >
        <FormattedMessage
          id="account.familiar_followers.more"
          defaultMessage="{count, plural, one {# other} other {# others}} you follow"
          values={{ count: familiarFollowerIds.size - familiarFollowers.size }}
        />
      </span>
    );
  }

  return (
    <HStack space={2} alignItems="center">
      <AvatarStack accountIds={familiarFollowerIds} />
      <Text theme="muted" size="sm" tag="div">
        <FormattedMessage
          id="account.familiar_followers"
          defaultMessage="Followed by {accounts}"
          values={{
            accounts: <FormattedList type="conjunction" value={accounts} />,
          }}
        />
      </Text>
    </HStack>
  );
};

export default ProfileFamiliarFollowers;

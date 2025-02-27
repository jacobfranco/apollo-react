import { useFloating } from "@floating-ui/react";
import calendarIcon from "@tabler/icons/outline/calendar.svg";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";

import { fetchRelationships } from "src/actions/accounts";
import {
  closeProfileHoverCard,
  updateProfileHoverCard,
} from "src/actions/profile-hover-card";
import { useAccount } from "src/api/hooks/index";
import Badge from "src/components/Badge";
import Markup from "src/components/Markup";
import { Card, CardBody } from "src/components/Card";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import ActionButton from "src/components/ActionButton";
import { UserPanel } from "src/features/AsyncComponents";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";

import { showProfileHoverCard } from "src/components/HoverRefWrapper";
import { dateFormatOptions } from "src/components/RelativeTimestamp";

import type { Account } from "src/schemas/index";
import type { AppDispatch } from "src/store";

const getBadges = (
  account?: Pick<Account, "admin" | "moderator">
): JSX.Element[] => {
  const badges = [];

  if (account?.admin) {
    badges.push(
      <Badge
        key="admin"
        slug="admin"
        title={
          <FormattedMessage
            id="account_moderation_modal.roles.admin"
            defaultMessage="Admin"
          />
        }
      />
    );
  } else if (account?.moderator) {
    badges.push(
      <Badge
        key="moderator"
        slug="moderator"
        title={
          <FormattedMessage
            id="account_moderation_modal.roles.moderator"
            defaultMessage="Moderator"
          />
        }
      />
    );
  }

  return badges;
};

const handleMouseEnter = (dispatch: AppDispatch): React.MouseEventHandler => {
  return () => {
    dispatch(updateProfileHoverCard());
  };
};

const handleMouseLeave = (dispatch: AppDispatch): React.MouseEventHandler => {
  return () => {
    dispatch(closeProfileHoverCard(true));
  };
};

interface IProfileHoverCard {
  visible?: boolean;
}

/** Popup profile preview that appears when hovering avatars and display names. */
export const ProfileHoverCard: React.FC<IProfileHoverCard> = ({
  visible = true,
}) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const intl = useIntl();

  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const me = useAppSelector((state) => state.me);
  const accountId: string | undefined = useAppSelector(
    (state) => state.profile_hover_card.accountId || undefined
  );
  const { account } = useAccount(accountId, { withRelationship: true });
  const targetRef = useAppSelector(
    (state) => state.profile_hover_card.ref?.current
  );
  const badges = getBadges(account);

  useEffect(() => {
    if (accountId) dispatch(fetchRelationships([accountId]));
  }, [dispatch, accountId]);

  useEffect(() => {
    const unlisten = history.listen(() => {
      showProfileHoverCard.cancel();
      dispatch(closeProfileHoverCard());
    });

    return () => {
      unlisten();
    };
  }, []);

  const { floatingStyles } = useFloating({
    elements: {
      floating: popperElement,
      reference: targetRef,
    },
  });

  if (!account) return null;
  const memberSinceDate = intl.formatDate(account.created_at, {
    month: "long",
    year: "numeric",
  });
  const followedBy =
    me !== account.id && account.relationship?.followed_by === true;

  return (
    <div
      className={clsx({
        "absolute transition-opacity w-[320px] z-[101] top-0 left-0": true,
        "opacity-100": visible,
        "opacity-0 pointer-events-none": !visible,
      })}
      ref={setPopperElement}
      style={floatingStyles}
      onMouseEnter={handleMouseEnter(dispatch)}
      onMouseLeave={handleMouseLeave(dispatch)}
    >
      <Card variant="rounded" className="relative isolate overflow-hidden">
        <CardBody>
          <Stack space={2}>
            <UserPanel
              accountId={account.id}
              action={<ActionButton account={account} small />}
              badges={badges}
            />

            <HStack alignItems="center" space={0.5}>
              <Icon
                src={calendarIcon}
                className="size-4 text-gray-800 dark:text-gray-200"
              />

              <Text
                size="sm"
                title={intl.formatDate(account.created_at, dateFormatOptions)}
              >
                <FormattedMessage
                  id="account.member_since"
                  defaultMessage="Joined {date}"
                  values={{
                    date: memberSinceDate,
                  }}
                />
              </Text>
            </HStack>
          </Stack>

          {followedBy && (
            <div className="absolute left-2 top-2">
              <Badge
                slug="opaque"
                title={
                  <FormattedMessage
                    id="account.follows_you"
                    defaultMessage="Follows you"
                  />
                }
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileHoverCard;

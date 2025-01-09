import balloonIcon from "@tabler/icons/outline/balloon.svg";
import calendarIcon from "@tabler/icons/outline/calendar.svg";
import linkIcon from "@tabler/icons/outline/link.svg";
import lockIcon from "@tabler/icons/outline/lock.svg";
import mapPinIcon from "@tabler/icons/outline/map-pin.svg";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";

import Badge from "src/components/Badge";
import Markup from "src/components/Markup";
import { dateFormatOptions } from "src/components/RelativeTimestamp";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppSelector } from "src/hooks/useAppSelector";
import { capitalize } from "src/utils/strings";

import ProfileFamiliarFollowers from "src/components/ProfileFamiliarFollowers";
import ProfileField from "src/components/ProfileField";
import ProfileStats from "src/features/ProfileStats";

import type { Account } from "src/schemas";

const isSafeUrl = (text: string): boolean => {
  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol);
  } catch (e) {
    return false;
  }
};

const messages = defineMessages({
  linkVerifiedOn: {
    id: "account.link_verified_on",
    defaultMessage: "Ownership of this link was checked on {date}",
  },
  account_locked: {
    id: "account.locked_info",
    defaultMessage:
      "This account privacy status is set to locked. The owner manually reviews who can follow them.",
  },
  deactivated: { id: "account.deactivated", defaultMessage: "Deactivated" },
  bot: { id: "account.badges.bot", defaultMessage: "Bot" },
});

interface IProfileInfoPanel {
  account?: Account;
  /** Username from URL params, in case the account isn't found. */
  username: string;
}

/** User profile metadata, such as location, birthday, etc. */
const ProfileInfoPanel: React.FC<IProfileInfoPanel> = ({
  account,
  username,
}) => {
  const intl = useIntl();
  const me = useAppSelector((state) => state.me);
  const ownAccount = account?.id === me;

  const getStaffBadge = (): React.ReactNode => {
    if (account?.admin) {
      return (
        <Badge
          slug="admin"
          title={
            <FormattedMessage
              id="account_moderation_modal.roles.admin"
              defaultMessage="Admin"
            />
          }
          key="staff"
        />
      );
    } else if (account?.moderator) {
      return (
        <Badge
          slug="moderator"
          title={
            <FormattedMessage
              id="account_moderation_modal.roles.moderator"
              defaultMessage="Moderator"
            />
          }
          key="staff"
        />
      );
    } else {
      return null;
    }
  };

  const getCustomBadges = (): React.ReactNode[] => {
    const badges = account?.tags || [];

    return badges
      .filter((tag) => tag.startsWith("badge:"))
      .map((tag) => {
        const name = tag.replace("badge:", "");
        return <Badge key={tag} slug={tag} title={capitalize(name)} />;
      });
  };

  const getBadges = (): React.ReactNode[] => {
    const custom = getCustomBadges();
    const staffBadge = getStaffBadge();

    const badges = [];

    if (staffBadge) {
      badges.push(staffBadge);
    }

    return [...badges, ...custom];
  };

  const renderBirthday = (): React.ReactNode => {
    const birthday = account?.birthday;
    if (!birthday) return null;

    const formattedBirthday = intl.formatDate(birthday, {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const date = new Date(birthday);
    const today = new Date();

    const hasBirthday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth();

    return (
      <HStack alignItems="center" space={0.5}>
        <Icon
          src={balloonIcon}
          className="size-4 text-gray-800 dark:text-gray-200"
        />

        <Text size="sm">
          {hasBirthday ? (
            <FormattedMessage
              id="account.birthday_today"
              defaultMessage="Birthday is today!"
            />
          ) : (
            <FormattedMessage
              id="account.birthday"
              defaultMessage="Born {date}"
              values={{ date: formattedBirthday }}
            />
          )}
        </Text>
      </HStack>
    );
  };

  if (!account) {
    return (
      <div className="mt-6 min-w-0 flex-1 sm:px-2">
        <Stack space={2}>
          <Stack>
            <HStack space={1} alignItems="center">
              {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
              <Text size="sm" theme="muted" direction="ltr" truncate>
                @{username}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </div>
    );
  }

  const deactivated = account.suspended ?? false;
  const memberSinceDate = intl.formatDate(account.created_at, {
    month: "long",
    year: "numeric",
  });
  const badges = getBadges();

  return (
    <div className="mt-6 min-w-0 flex-1 sm:px-2">
      <Stack space={2}>
        <Stack>
          <HStack space={1} alignItems="center">
            <Text size="lg" weight="bold" truncate>
              {deactivated
                ? intl.formatMessage(messages.deactivated)
                : account.display_name}
            </Text>

            {account.bot && (
              <Badge slug="bot" title={intl.formatMessage(messages.bot)} />
            )}

            {badges.length > 0 && (
              <HStack space={1} alignItems="center">
                {badges}
              </HStack>
            )}
          </HStack>

          <HStack alignItems="center" space={0.5}>
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            <Text size="sm" theme="muted" direction="ltr" truncate>
              @{account.username}
            </Text>

            {account.locked && (
              <Icon
                src={lockIcon}
                alt={intl.formatMessage(messages.account_locked)}
                className="size-4 text-gray-600"
              />
            )}
          </HStack>
        </Stack>

        <ProfileStats account={account} />

        {account.note.length > 0 && (
          <Markup size="sm" html={{ __html: account.note }} truncate />
        )}

        <div className="flex flex-col items-start gap-2 md:flex-row md:flex-wrap md:items-center">
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

          {account.location ? (
            <HStack alignItems="center" space={0.5}>
              <Icon
                src={mapPinIcon}
                className="size-4 text-gray-800 dark:text-gray-200"
              />

              <Text size="sm">{account.location}</Text>
            </HStack>
          ) : null}

          {account.website ? (
            <HStack alignItems="center" space={0.5}>
              <Icon
                src={linkIcon}
                className="size-4 text-gray-800 dark:text-gray-200"
              />

              <div className="max-w-[300px]">
                <Text size="sm" truncate>
                  {isSafeUrl(account.website) ? (
                    <a
                      className="text-primary-600 hover:underline dark:text-accent-blue"
                      href={account.website}
                      target="_blank"
                    >
                      {account.website}
                    </a>
                  ) : (
                    account.website
                  )}
                </Text>
              </div>
            </HStack>
          ) : null}

          {renderBirthday()}
        </div>

        {ownAccount ? null : <ProfileFamiliarFollowers account={account} />}
      </Stack>

      {account.fields.length > 0 && (
        <Stack space={2} className="mt-4 xl:hidden">
          {account.fields.map((field, i) => (
            <ProfileField field={field} key={i} />
          ))}
        </Stack>
      )}
    </div>
  );
};

export default ProfileInfoPanel;

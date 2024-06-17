import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { dateFormatOptions } from 'src/components/RelativeTimestamp';
import { Badge, HStack, Icon, Markup, ProfileFamiliarFollowers, ProfileField, Stack, Text } from 'src/components';
import ProfileStats from 'src/features/ProfileStats';
import { useAppSelector } from 'src/hooks';

import type { Account } from 'src/schemas';

/** Basically ensure the URL isn't `javascript:alert('hi')` or something like that */
const isSafeUrl = (text: string): boolean => {
  try {
    const url = new URL(text);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (e) {
    return false;
  }
};

const messages = defineMessages({
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  deactivated: { id: 'account.deactivated', defaultMessage: 'Deactivated' },
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
});

interface IProfileInfoPanel {
  account?: Account;
  /** Username from URL params, in case the account isn't found. */
  username: string;
}

/** User profile metadata, such as location, birthday, etc. */
const ProfileInfoPanel: React.FC<IProfileInfoPanel> = ({ account, username }) => {
  const intl = useIntl();
  const me = useAppSelector(state => state.me);
  const ownAccount = account?.id === me;

  const getStaffBadge = (): React.ReactNode => {
    if (account?.admin) {
      return <Badge slug='admin' title={<FormattedMessage id='account_moderation_modal.roles.admin' defaultMessage='Admin' />} key='staff' />;
    } else if (account?.moderator) {
      return <Badge slug='moderator' title={<FormattedMessage id='account_moderation_modal.roles.moderator' defaultMessage='Moderator' />} key='staff' />;
    } else {
      return null;
    }
  };

  const renderBirthday = (): React.ReactNode => {
    const birthday = account?.birthday;
    if (!birthday) return null;

    const formattedBirthday = intl.formatDate(birthday, { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });

    const date = new Date(birthday);
    const today = new Date();

    const hasBirthday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();

    return (
      <HStack alignItems='center' space={0.5}>
        <Icon
          src={require('@tabler/icons/outline/balloon.svg')}
          className='h-4 w-4 text-gray-800 dark:text-gray-200'
        />

        <Text size='sm'>
          {hasBirthday ? (
            <FormattedMessage id='account.birthday_today' defaultMessage='Birthday is today!' />
          ) : (
            <FormattedMessage id='account.birthday' defaultMessage='Born {date}' values={{ date: formattedBirthday }} />
          )}
        </Text>
      </HStack>
    );
  };

  if (!account) {
    return (
      <div className='mt-6 min-w-0 flex-1 sm:px-2'>
        <Stack space={2}>
          <Stack>
            <HStack space={1} alignItems='center'>
              <Text size='sm' theme='muted' direction='ltr' truncate>
                @{username}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </div>
    );
  }

  const deactivated = account.deactivated ?? false;
  const displayNameHtml = deactivated ? { __html: intl.formatMessage(messages.deactivated) } : { __html: account.display_name_html };
  const memberSinceDate = intl.formatDate(account.created_at, { month: 'long', year: 'numeric' });

  return (
    <div className='mt-6 min-w-0 flex-1 sm:px-2'>
      <Stack space={2}>
        <Stack>
          <HStack space={1} alignItems='center'>
            <Text size='lg' weight='bold' dangerouslySetInnerHTML={displayNameHtml} truncate />

            {account.bot && <Badge slug='bot' title={intl.formatMessage(messages.bot)} />}

          </HStack>

          <HStack alignItems='center' space={0.5}>
            <Text size='sm' theme='muted' direction='ltr' truncate>
              @{account.username}
            </Text>

            {account.locked && (
              <Icon
                src={require('@tabler/icons/outline/lock.svg')}
                alt={intl.formatMessage(messages.account_locked)}
                className='h-4 w-4 text-gray-600'
              />
            )}
          </HStack>
        </Stack>

        <ProfileStats account={account} />

        {account.note.length > 0 && (
          <Markup size='sm' dangerouslySetInnerHTML={{ __html: account.note_emojified }} truncate />
        )}

        <div className='flex flex-col items-start gap-2 md:flex-row md:flex-wrap md:items-center'>
            <HStack alignItems='center' space={0.5}>
              <Icon
                src={require('@tabler/icons/outline/calendar.svg')}
                className='h-4 w-4 text-gray-800 dark:text-gray-200'
              />

              <Text size='sm' title={intl.formatDate(account.created_at, dateFormatOptions)}>
                <FormattedMessage
                  id='account.member_since' defaultMessage='Joined {date}' values={{
                    date: memberSinceDate,
                  }}
                />
              </Text>
            </HStack>

          {account.location ? (
            <HStack alignItems='center' space={0.5}>
              <Icon
                src={require('@tabler/icons/outline/map-pin.svg')}
                className='h-4 w-4 text-gray-800 dark:text-gray-200'
              />

              <Text size='sm'>
                {account.location}
              </Text>
            </HStack>
          ) : null}

          {account.website ? (
            <HStack alignItems='center' space={0.5}>
              <Icon
                src={require('@tabler/icons/outline/link.svg')}
                className='h-4 w-4 text-gray-800 dark:text-gray-200'
              />

              <div className='max-w-[300px]'>
                <Text size='sm' truncate>
                  {isSafeUrl(account.website) ? (
                    <a className='text-primary-600 hover:underline dark:text-accent-blue' href={account.website} target='_blank'>{account.website}</a>
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
        <Stack space={2} className='mt-4 xl:hidden'>
          {account.fields.map((field, i) => (
            <ProfileField field={field} key={i} />
          ))}
        </Stack>
      )}
    </div>
  );
};

export default ProfileInfoPanel;
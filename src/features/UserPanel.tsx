import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { useAccount } from 'src/api/hooks';
import { Avatar, HStack, Stack, StillImage, Text, VerificationBadge } from 'src/components';
import { useAppSelector } from 'src/hooks';
import { getAcct } from 'src/utils/accounts';
import { shortNumberFormat } from 'src/utils/numbers';
// import { displayFqn } from 'src/utils/state';

interface IUserPanel {
  accountId: string;
  action?: JSX.Element;
  badges?: JSX.Element[];
  domain?: string;
}

const UserPanel: React.FC<IUserPanel> = ({ accountId, action, badges, domain }) => {
  const intl = useIntl();
  const { account } = useAccount(accountId);
  // const fqn = useAppSelector((state) => displayFqn(state));

  if (!account) return null;
  const displayNameHtml = { __html: account.display_name_html };
  const acct = !account.acct.includes('@') && domain ? `${account.acct}@${domain}` : account.acct;
  const header = account.header;
  const verified = account.verified;

  return (
    <div className='relative'>
      <Stack space={2}>
        <Stack>
          <div className='relative -mx-4 -mt-4 h-24 overflow-hidden bg-gray-200'>
            {header && (
              <StillImage src={account.header} />
            )}
          </div>

          <HStack justifyContent='between'>
            <Link
              to={`/@${account.acct}`}
              title={acct}
              className='-mt-12 block'
            >
              <Avatar src={account.avatar} size={80} className='h-20 w-20 overflow-hidden bg-gray-50 ring-2 ring-white' />
            </Link>

            {action && (
              <div className='mt-2'>{action}</div>
            )}
          </HStack>
        </Stack>

        <Stack>
          <Link to={`/@${account.acct}`}>
            <HStack space={1} alignItems='center'>
              <Text size='lg' weight='bold' dangerouslySetInnerHTML={displayNameHtml} truncate />

              {verified && <VerificationBadge />}

              {badges && badges.length > 0 && (
                <HStack space={1} alignItems='center'>
                  {badges}
                </HStack>
              )}
            </HStack>
          </Link>

          <HStack>
            <Text size='sm' theme='muted' direction='ltr' truncate>
              @{account.username}
            </Text>
          </HStack>
        </Stack>

        <HStack alignItems='center' space={3}>
          {account.followers_count >= 0 && (
            <Link to={`/@${account.acct}/followers`} title={intl.formatNumber(account.followers_count)}>
              <HStack alignItems='center' space={1}>
                <Text theme='primary' weight='bold' size='sm'>
                  {shortNumberFormat(account.followers_count)}
                </Text>
                <Text weight='bold' size='sm'>
                  <FormattedMessage id='account.followers' defaultMessage='Followers' />
                </Text>
              </HStack>
            </Link>
          )}

          {account.following_count >= 0 && (
            <Link to={`/@${account.acct}/following`} title={intl.formatNumber(account.following_count)}>
              <HStack alignItems='center' space={1}>
                <Text theme='primary' weight='bold' size='sm'>
                  {shortNumberFormat(account.following_count)}
                </Text>
                <Text weight='bold' size='sm'>
                  <FormattedMessage id='account.follows' defaultMessage='Following' />
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
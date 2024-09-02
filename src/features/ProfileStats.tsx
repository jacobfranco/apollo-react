import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { HStack, Text } from 'src/components';
import { shortNumberFormat } from 'src/utils/numbers';

import type { Account } from 'src/schemas';

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Following' },
});

interface IProfileStats {
  account: Pick<Account, 'username' | 'followers_count' | 'following_count'> | undefined;
  onClickHandler?: React.MouseEventHandler;
}

/** Display follower and following counts for an account. */
const ProfileStats: React.FC<IProfileStats> = ({ account, onClickHandler }) => {
  const intl = useIntl();

  if (!account) {
    return null;
  }

  return (
    <HStack alignItems='center' space={3}>
      <NavLink to={`/@${account.username}/followers`} onClick={onClickHandler} title={intl.formatNumber(account.followers_count)} className='hover:underline'>
        <HStack alignItems='center' space={1}>
          <Text theme='primary' weight='bold' size='sm'>
            {shortNumberFormat(account.followers_count)}
          </Text>
          <Text weight='bold' size='sm'>
            {intl.formatMessage(messages.followers)}
          </Text>
        </HStack>
      </NavLink>

      <NavLink to={`/@${account.username}/following`} onClick={onClickHandler} title={intl.formatNumber(account.following_count)} className='hover:underline'>
        <HStack alignItems='center' space={1}>
          <Text theme='primary' weight='bold' size='sm'>
            {shortNumberFormat(account.following_count)}
          </Text>
          <Text weight='bold' size='sm'>
            {intl.formatMessage(messages.follows)}
          </Text>
        </HStack>
      </NavLink>
    </HStack>
  );
};

export default ProfileStats;
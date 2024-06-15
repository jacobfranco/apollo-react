import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { GroupActionButton, GroupAvatar, HStack, Icon, Stack, Text } from 'src/components';
import { Group as GroupEntity } from 'src/types/entities';
import { shortNumberFormat } from 'src/utils/numbers';

interface IGroupListItem {
  group: GroupEntity;
  withJoinAction?: boolean;
}

const GroupListItem = (props: IGroupListItem) => {
  const { group, withJoinAction = true } = props;

  return (
    <HStack
      alignItems='center'
      justifyContent='between'
      data-testid='group-list-item'
    >
      <Link key={group.id} to={`/group/${group.slug}`} className='overflow-hidden'>
        <HStack alignItems='center' space={2}>
          <GroupAvatar
            group={group}
            size={44}
          />

          <Stack className='overflow-hidden'>
            <Text
              weight='bold'
              dangerouslySetInnerHTML={{ __html: group.display_name_html }}
              truncate
            />

            <HStack className='text-gray-700 dark:text-gray-600' space={1} alignItems='center'>
              <Icon
                className='h-4.5 w-4.5'
                src={group.locked ? require('@tabler/icons/outline/lock.svg') : require('@tabler/icons/outline/world.svg')}
              />

              <Text theme='inherit' tag='span' size='sm' weight='medium'>
                {group.locked ? (
                  <FormattedMessage id='group.privacy.locked' defaultMessage='Private' />
                ) : (
                  <FormattedMessage id='group.privacy.public' defaultMessage='Public' />
                )}
              </Text>

              {typeof group.members_count !== 'undefined' && (
                <>
                  <span>&bull;</span>
                  <Text theme='inherit' tag='span' size='sm' weight='medium'>
                    {shortNumberFormat(group.members_count)}
                    {' '}
                    <FormattedMessage
                      id='groups.discover.search.results.member_count'
                      defaultMessage='{members, plural, one {member} other {members}}'
                      values={{
                        members: group.members_count,
                      }}
                    />
                  </Text>
                </>
              )}
            </HStack>
          </Stack>
        </HStack>
      </Link>

      {withJoinAction && (
        <GroupActionButton group={group} />
      )}
    </HStack>
  );
};

export default GroupListItem;
import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { useUnmuteGroup } from 'src/api/hooks';
import { Button, GroupAvatar, HStack, Text } from 'src/components';
import { type Group } from 'src/schemas';
import toast from 'src/toast';

interface IMuteGroupListItem {
  group: Group;
  onUnmute(): void;
}

const messages = defineMessages({
  unmuteSuccess: { id: 'group.unmute.success', defaultMessage: 'Unmuted the group' },
});

const MuteGroupListItem = ({ group, onUnmute }: IMuteGroupListItem) => {
  const intl = useIntl();

  const unmuteGroup = useUnmuteGroup(group);

  const handleUnmute = () => {
    unmuteGroup.mutate(undefined, {
      onSuccess() {
        onUnmute();
        toast.success(intl.formatMessage(messages.unmuteSuccess));
      },
    });
  };

  return (
    <HStack alignItems='center' justifyContent='between'>
      <HStack alignItems='center' space={3}>
        <GroupAvatar
          group={group}
          size={42}
        />

        <Text
          weight='semibold'
          size='sm'
          dangerouslySetInnerHTML={{ __html: group.display_name_html }}
          truncate
        />
      </HStack>

      <Button theme='primary' type='button' onClick={handleUnmute} size='sm'>
        <FormattedMessage id='group.unmute.label' defaultMessage='Unmute' />
      </Button>
    </HStack>
  );
};

export default MuteGroupListItem;
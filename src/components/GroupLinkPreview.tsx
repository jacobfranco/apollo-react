import React from 'react';

import { CardTitle, Stack } from 'src/components';
import { type Card as StatusCard } from 'src/types/entities';
import Avatar from './Avatar';
import Button from './Button';

interface IGroupLinkPreview {
  card: StatusCard;
}

const GroupLinkPreview: React.FC<IGroupLinkPreview> = ({ card }) => {
  const { group } = card;
  if (!group) return null;

  return (
    <Stack className='cursor-default overflow-hidden rounded-lg border border-gray-300 text-center dark:border-gray-800'>
      <div
        className='-mb-8 h-32 w-full bg-cover bg-center'
        style={{ backgroundImage: `url(${group.header})` }}
      />

      <Avatar
        className='mx-auto border-4 border-white dark:border-primary-900'
        src={group.avatar}
        size={64}
      />

      <Stack space={4} className='p-4'>
        <CardTitle title={<span dangerouslySetInnerHTML={{ __html: group.display_name_html }} />} />

        <Button theme='primary' to={`/group/${group.slug}`} block>
          View Group
        </Button>
      </Stack>
    </Stack>
  );
};

export { GroupLinkPreview };
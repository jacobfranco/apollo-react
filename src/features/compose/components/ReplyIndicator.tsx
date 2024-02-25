import clsx from 'clsx';
import React from 'react';

import { AttachmentThumbs, Markup, Stack } from 'src/components';
import AccountContainer from 'src/containers/AccountContainer';
import { getTextDirection } from 'src/utils/rtl';

import type { Status } from 'src/types/entities';

interface IReplyIndicator {
  className?: string;
  status?: Status;
  onCancel?: () => void;
  hideActions: boolean;
}

const ReplyIndicator: React.FC<IReplyIndicator> = ({ className, status, hideActions, onCancel }) => {
  const handleClick = () => {
    onCancel!();
  };

  if (!status) {
    return null;
  }

  let actions = {};
  if (!hideActions && onCancel) {
    actions = {
      onActionClick: handleClick,
      actionIcon: require('@tabler/icons/x.svg'),
      actionAlignment: 'top',
      actionTitle: 'Dismiss',
    };
  }

  return (
    <Stack space={2} className={clsx('max-h-72 overflow-y-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800', className)}>
      <AccountContainer
        {...actions}
        id={status.getIn(['account', 'id']) as string}
        timestamp={status.created_at}
        showProfileHoverCard={false}
        withLinkToProfile={false}
        hideActions={hideActions}
      />

      <Markup
        className='break-words'
        size='sm'
        dangerouslySetInnerHTML={{ __html: status.contentHtml }}
        direction={getTextDirection(status.search_index)}
      />

      {status.media_attachments.size > 0 && (
        <AttachmentThumbs
          media={status.media_attachments}
          sensitive={status.sensitive}
        />
      )}
    </Stack>
  );
};

export default ReplyIndicator;
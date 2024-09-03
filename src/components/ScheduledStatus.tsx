import clsx from 'clsx';
import React from 'react';

import { Account, AttachmentThumbs, HStack, PollPreview, ScheduledStatusActionBar, StatusReplyMentions, Stack } from 'src/components';
import { useAppSelector } from 'src/hooks';

import { buildStatus } from 'src/utils/scheduled-statuses'


import type { Status as StatusEntity } from 'src/types/entities';
import StatusContent from './StatusContent';

interface IScheduledStatus {
  statusId: string;
}

const ScheduledStatus: React.FC<IScheduledStatus> = ({ statusId, ...other }) => {
  const status = useAppSelector((state) => {
    const scheduledStatus = state.scheduled_statuses.get(statusId);
    if (!scheduledStatus) return null;
    return buildStatus(state, scheduledStatus);
  }) as StatusEntity | null;

  if (!status) return null;

  const account = status.account;

  return (
    <div className={clsx('status__wrapper', `status__wrapper-${status.visibility}`, { 'status__wrapper-reply': !!status.in_reply_to_id })} tabIndex={0}>
      <div className={clsx('status', `status-${status.visibility}`, { 'status-reply': !!status.in_reply_to_id })} data-id={status.id}>
        <div className='mb-4'>
          <HStack justifyContent='between' alignItems='start'>
            <Account
              key={account.id}
              account={account}
              timestamp={status.created_at}
              futureTimestamp
              action={<ScheduledStatusActionBar status={status} {...other} />}
            />
          </HStack>
        </div>

        <StatusReplyMentions status={status} />

        <Stack space={4}>
          <StatusContent
            status={status}
            collapsable
          />

          {status.media_attachments.size > 0 && (
            <AttachmentThumbs
              media={status.media_attachments}
              sensitive={status.sensitive}
            />
          )}

          {status.poll && <PollPreview pollId={status.poll as string} />}
        </Stack>
      </div>
    </div>
  );
};

export default ScheduledStatus;
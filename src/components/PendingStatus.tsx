import clsx from 'clsx';
import React from 'react';

import { Account, StatusContent, Card, HStack, Stack, StatusReplyMentions, PlaceholderCard, PlaceholderMediaGallery, PollPreview } from 'src/components';
import QuotedStatus from 'src/containers/StatusQuotedStatusContainer';
import { useAppSelector } from 'src/hooks';

import { buildStatus } from 'src/utils/pending-status';

import type { Status as StatusEntity } from 'src/types/entities';

const shouldHaveCard = (pendingStatus: StatusEntity) => {
  return Boolean(pendingStatus.content.match(/https?:\/\/\S*/));
};

interface IPendingStatus {
  className?: string;
  idempotencyKey: string;
  muted?: boolean;
  thread?: boolean;
}

interface IPendingStatusMedia {
  status: StatusEntity;
}

const PendingStatusMedia: React.FC<IPendingStatusMedia> = ({ status }) => {
  if (status.media_attachments && !status.media_attachments.isEmpty()) {
    return (
      <PlaceholderMediaGallery
        media={status.media_attachments}
      />
    );
  } else if (!status.quote && shouldHaveCard(status)) {
    return <PlaceholderCard />;
  } else {
    return null;
  }
};

const PendingStatus: React.FC<IPendingStatus> = ({ idempotencyKey, className, muted, thread = false }) => {
  const status = useAppSelector((state) => {
    const pendingStatus = state.pending_statuses.get(idempotencyKey);
    return pendingStatus ? buildStatus(state, pendingStatus, idempotencyKey) : null;
  }) as StatusEntity | null;

  if (!status) return null;
  if (!status.account) return null;

  const account = status.account;

  return (
    <div className={clsx('opacity-50', className)}>
      <div className={clsx('status', { 'status-reply': !!status.in_reply_to_id, muted })} data-id={status.id}>
        <Card
          className={clsx('py-6 sm:p-5', `status-${status.visibility}`, { 'status-reply': !!status.in_reply_to_id })}
          variant={thread ? 'default' : 'rounded'}
        >
          <div className='mb-4'>
            <HStack justifyContent='between' alignItems='start'>
              <Account
                key={account.id}
                account={account}
                timestamp={status.created_at}
                hideActions
                withLinkToProfile={false}
              />
            </HStack>
          </div>

          <div className='status__content-wrapper'>
            <StatusReplyMentions status={status} />

            <Stack space={4}>
              <StatusContent
                status={status}
                collapsable
              />

              <PendingStatusMedia status={status} />

              {status.poll && <PollPreview pollId={status.poll as string} />}

              {status.quote && <QuotedStatus statusId={status.quote as string} />}
            </Stack>
          </div>

          {/* TODO */}
          {/* <PlaceholderActionBar /> */}
        </Card>
      </div>
    </div>
  );
};

export default PendingStatus;
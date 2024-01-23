import React, { useRef } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import ActionButton from 'src/features/ActionButton';
import { useAppSelector } from 'src/hooks';
import { getAcct } from 'src/utils/accounts';

import {
     Avatar, 
     Badge, 
     /* Emoji, */ 
     HStack, 
     HoverRefWrapper, 
     Icon, 
     IconButton, 
     RelativeTimestamp,
     Stack,
    Text, 
    VerificationBadge 
} from 'src/components';

// import type { StatusApprovalStatus } from 'soapbox/normalizers/status';
import type { Account as AccountSchema } from 'src/schemas';

interface IInstanceFavicon {
  account: AccountSchema;
  disabled?: boolean;
}

const messages = defineMessages({
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
});

interface IProfilePopper {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}

const ProfilePopper: React.FC<IProfilePopper> = ({ condition, wrapper, children }) => {
  return (
    <>
      {condition ? wrapper(children) : children}
    </>
  );
};

export interface IAccount {
  account: AccountSchema;
  action?: React.ReactElement;
  actionAlignment?: 'center' | 'top';
  actionIcon?: string;
  actionTitle?: string;
  /** Override other actions for specificity like mute/unmute. */
  actionType?: 'muting' | 'blocking' | 'follow_request';
  avatarSize?: number;
  hidden?: boolean;
  hideActions?: boolean;
  id?: string;
  onActionClick?: (account: any) => void;
  showProfileHoverCard?: boolean;
  timestamp?: string;
  timestampUrl?: string;
  futureTimestamp?: boolean;
  withAccountNote?: boolean;
  withDate?: boolean;
  withLinkToProfile?: boolean;
  withRelationship?: boolean;
  showEdit?: boolean;
  // approvalStatus?: StatusApprovalStatus;
  emoji?: string;
  emojiUrl?: string;
  note?: string;
}

const Account = ({
  account,
  actionType,
  action,
  actionIcon,
  actionTitle,
  actionAlignment = 'center',
  avatarSize = 42,
  hidden = false,
  hideActions = false,
  onActionClick,
  showProfileHoverCard = true,
  timestamp,
  timestampUrl,
  futureTimestamp = false,
  withAccountNote = false,
  withDate = false,
  withLinkToProfile = true,
  withRelationship = true,
  showEdit = false,
  // approvalStatus,
  emoji,
  emojiUrl,
  note,
}: IAccount) => {
  const overflowRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const me = useAppSelector((state) => state.me);
  const username = useAppSelector((state) => account ? account.username : null);

  const handleAction = () => {
    onActionClick!(account);
  };

  const renderAction = () => {
    if (action) {
      return action;
    }

    if (hideActions) {
      return null;
    }

    if (onActionClick && actionIcon) {
      return (
        <IconButton
          src={actionIcon}
          title={actionTitle}
          onClick={handleAction}
          className='bg-transparent text-gray-600 hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-500'
          iconClassName='h-4 w-4'
        />
      );
    }

    if (account.id !== me) {
      return <ActionButton account={account} actionType={actionType} />;
    }

    return null;
  };

  const intl = useIntl();

  if (!account) {
    return null;
  }

  if (hidden) {
    return (
      <>
        {account.displayName}
        {account.username}
      </>
    );
  }

  if (withDate) timestamp = account.createdAt;

  const LinkEl: any = withLinkToProfile ? Link : 'div';
  const linkProps = withLinkToProfile ? {
    to: `/@${account.acct}`,
    title: account.acct,
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
  } : {};

  return (
    <div data-testid='account' className='group block w-full shrink-0' ref={overflowRef}>
      <HStack alignItems={actionAlignment} space={3} justifyContent='between'>
        <HStack alignItems={withAccountNote || note ? 'top' : 'center'} space={3} className='overflow-hidden'>
          <ProfilePopper
            condition={showProfileHoverCard}
            wrapper={(children) => <HoverRefWrapper className='relative' accountId={account.id} inline>{children}</HoverRefWrapper>}
          >
            <LinkEl className='rounded-full' {...linkProps}>
              <Avatar src={account.avatar} size={avatarSize} />
              { /* emoji && ( TODO: Implement Emoji
                <Emoji
                  className='absolute -right-1.5 bottom-0 h-5 w-5'
                  emoji={emoji}
                  src={emojiUrl}
                />
              ) */ }
            </LinkEl>
          </ProfilePopper>

          <div className='grow overflow-hidden'>
            <ProfilePopper
              condition={showProfileHoverCard}
              wrapper={(children) => <HoverRefWrapper accountId={account.id} inline>{children}</HoverRefWrapper>}
            >
              <LinkEl {...linkProps}>
                <HStack space={1} alignItems='center' grow>
                  <Text
                    size='sm'
                    weight='semibold'
                    truncate
                    dangerouslySetInnerHTML={{ __html: account.displayName }}
                  />

                  {account.verified && <VerificationBadge />}

                  {account.bot && <Badge slug='bot' title={intl.formatMessage(messages.bot)} />}
                </HStack>
              </LinkEl>
            </ProfilePopper>

            <Stack space={withAccountNote || note ? 1 : 0}>
              <HStack alignItems='center' space={1}>
                <Text theme='muted' size='sm' direction='ltr' truncate>@{username}</Text>


                {(timestamp) ? (
                  <>
                    <Text tag='span' theme='muted' size='sm'>&middot;</Text>

                    {timestampUrl ? (
                      <Link to={timestampUrl} className='hover:underline' onClick={(event) => event.stopPropagation()}>
                        <RelativeTimestamp timestamp={timestamp} theme='muted' size='sm' className='whitespace-nowrap' futureDate={futureTimestamp} />
                      </Link>
                    ) : (
                      <RelativeTimestamp timestamp={timestamp} theme='muted' size='sm' className='whitespace-nowrap' futureDate={futureTimestamp} />
                    )}
                  </>
                ) : null}

                { /* TODO: Implement approval Status approvalStatus && ['pending', 'rejected'].includes(approvalStatus) && ( 
                  <>
                    <Text tag='span' theme='muted' size='sm'>&middot;</Text>

                    <Text tag='span' theme='muted' size='sm'>
                      {approvalStatus === 'pending'
                        ? <FormattedMessage id='status.approval.pending' defaultMessage='Pending approval' />
                        : <FormattedMessage id='status.approval.rejected' defaultMessage='Rejected' />}
                    </Text>
                  </>
                ) */ }

                {showEdit ? (
                  <>
                    <Text tag='span' theme='muted' size='sm'>&middot;</Text>

                    <Icon className='h-5 w-5 text-gray-700 dark:text-gray-600' src={require('@tabler/icons/pencil.svg')} />
                  </>
                ) : null}

                {actionType === 'muting' && account.mute_expires_at ? (
                  <>
                    <Text tag='span' theme='muted' size='sm'>&middot;</Text>

                    <Text theme='muted' size='sm'><RelativeTimestamp timestamp={account.mute_expires_at} futureDate /></Text>
                  </>
                ) : null}
              </HStack>
            </Stack>
          </div>
        </HStack>

        <div ref={actionRef}>
          {withRelationship ? renderAction() : null}
        </div>
      </HStack>
    </div>
  );
};

export default Account;
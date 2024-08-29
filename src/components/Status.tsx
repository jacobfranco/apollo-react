import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';

import { mentionCompose, replyCompose } from 'src/actions/compose';
import { toggleLike, toggleRepost } from 'src/actions/interactions';
import { openModal } from 'src/actions/modals';
import { toggleStatusHidden, unfilterStatus } from 'src/actions/statuses';
import AccountContainer from 'src/containers/AccountContainer';
import QuotedStatus from 'src/containers/StatusQuotedStatusContainer';
import { HotKeys } from 'src/features/Hotkeys';
import { useAppDispatch, useSettings } from 'src/hooks';
import { defaultMediaVisibility, textForScreenReader, getActualStatus } from 'src/utils/status';

import {
  Card, Icon, Stack, Text, StatusActionBar, StatusContent,
  StatusMedia, StatusReplyMentions, SensitiveContentOverlay, StatusInfo
} from 'src/components';

import type { Status as StatusEntity } from 'src/types/entities';

// Defined in components/scrollable-list
export type ScrollPosition = { height: number; top: number };

const messages = defineMessages({
  reposted_by: { id: 'status.reposted_by', defaultMessage: '{name} reposted' },
});

export interface IStatus {
  id?: string;
  avatarSize?: number;
  status: StatusEntity;
  onClick?: () => void;
  muted?: boolean;
  hidden?: boolean;
  unread?: boolean;
  onMoveUp?: (statusId: string, featured?: boolean) => void;
  onMoveDown?: (statusId: string, featured?: boolean) => void;
  focusable?: boolean;
  featured?: boolean;
  hideActionBar?: boolean;
  hoverable?: boolean;
  variant?: 'default' | 'rounded' | 'slim';
  showGroup?: boolean;
  accountAction?: React.ReactElement;
}

const Status: React.FC<IStatus> = (props) => {
  const {
    status,
    accountAction,
    avatarSize = 42,
    focusable = true,
    hoverable = true,
    onClick,
    onMoveUp,
    onMoveDown,
    muted,
    hidden,
    featured,
    unread,
    hideActionBar,
    variant = 'rounded',
    showGroup = true,
  } = props;

  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { displayMedia, boostModal } = useSettings();
  const didShowCard = useRef(false);
  const node = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const [showMedia, setShowMedia] = useState<boolean>(defaultMediaVisibility(status, displayMedia));
  const [minHeight, setMinHeight] = useState(208);

  const actualStatus = getActualStatus(status);
  const isRepost = status.repost && typeof status.repost === 'object';
  const statusUrl = `/@${actualStatus.account.id}/posts/${actualStatus.id}`;
  const group = actualStatus.group;

  const filtered = (status.filtered.size || actualStatus.filtered.size) > 0;

  // Track height changes we know about to compensate scrolling.
  useEffect(() => {
    didShowCard.current = Boolean(!muted && !hidden && status?.card);
  }, []);

  useEffect(() => {
    setShowMedia(defaultMediaVisibility(status, displayMedia));
  }, [status.id]);

  useEffect(() => {
    if (overlay.current) {
      setMinHeight(overlay.current.getBoundingClientRect().height);
    }
  }, [overlay.current]);

  const handleToggleMediaVisibility = (): void => {
    setShowMedia(!showMedia);
  };

  const handleClick = (e?: React.MouseEvent): void => {
    e?.stopPropagation();

    // If the user is selecting text, don't focus the status.
    if (getSelection()?.toString().length) {
      return;
    }

    if (!e || !(e.ctrlKey || e.metaKey)) {
      if (onClick) {
        onClick();
      } else {
        history.push(statusUrl);
      }
    } else {
      window.open(statusUrl, '_blank');
    }
  };

  const handleHotkeyOpenMedia = (e?: KeyboardEvent): void => {
    const status = actualStatus;
    const firstAttachment = status.media_attachments.first();

    e?.preventDefault();

    if (firstAttachment) {
      if (firstAttachment.type === 'video') {
        dispatch(openModal('VIDEO', { status, media: firstAttachment, time: 0 }));
      } else {
        dispatch(openModal('MEDIA', { status, media: status.media_attachments, index: 0 }));
      }
    }
  };

  const handleHotkeyReply = (e?: KeyboardEvent): void => {
    e?.preventDefault();
    dispatch(replyCompose(actualStatus));
  };

  const handleHotkeyLike = (): void => {
    toggleLike(actualStatus);
  };

  const handleHotkeyBoost = (e?: KeyboardEvent): void => {
    const modalRepost = () => dispatch(toggleRepost(actualStatus));
    if ((e && e.shiftKey) || !boostModal) {
      modalRepost();
    } else {
      dispatch(openModal('BOOST', { status: actualStatus, onRepost: modalRepost }));
    }
  };

  const handleHotkeyMention = (e?: KeyboardEvent): void => {
    e?.preventDefault();
    dispatch(mentionCompose(actualStatus.account));
  };

  const handleHotkeyOpen = (): void => {
    history.push(statusUrl);
  };

  const handleHotkeyOpenProfile = (): void => {
    history.push(`/@${actualStatus.account.id}`);
  };

  const handleHotkeyMoveUp = (e?: KeyboardEvent): void => {
    if (onMoveUp) {
      onMoveUp(status.id, featured);
    }
  };

  const handleHotkeyMoveDown = (e?: KeyboardEvent): void => {
    if (onMoveDown) {
      onMoveDown(status.id, featured);
    }
  };

  const handleHotkeyToggleHidden = (): void => {
    dispatch(toggleStatusHidden(actualStatus));
  };

  const handleHotkeyToggleSensitive = (): void => {
    handleToggleMediaVisibility();
  };

  const handleHotkeyReact = (): void => {
    _expandEmojiSelector();
  };

  const handleUnfilter = () => dispatch(unfilterStatus(status.filtered.size ? status.id : actualStatus.id));

  const _expandEmojiSelector = (): void => {
    const firstEmoji: HTMLDivElement | null | undefined = node.current?.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
    firstEmoji?.focus();
  };

  const renderStatusInfo = () => {
    if (isRepost && showGroup && group) {
      return (
        <StatusInfo
          avatarSize={avatarSize}
          icon={<Icon src={require('@tabler/icons/outline/repeat.svg')} className='h-4 w-4 text-green-600' />}
          text={
            <FormattedMessage
              id='status.reposted_by_with_group'
              defaultMessage='{name} reposted from {group}'
              values={{
                name: (
                  <Link
                    to={`/@${status.account.id}`}
                    className='hover:underline'
                  >
                    <bdi className='truncate'>
                      <strong
                        className='text-gray-800 dark:text-gray-200'
                        dangerouslySetInnerHTML={{
                          __html: status.account.display_name,
                        }}
                      />
                    </bdi>
                  </Link>
                ),
                group: (
                  <Link to={`/group/${group.slug}`} className='hover:underline'>
                    <strong
                      className='text-gray-800 dark:text-gray-200'
                      dangerouslySetInnerHTML={{
                        __html: group.display_name_html,
                      }}
                    />
                  </Link>
                ),
              }}
            />
          }
        />
      );
    } else if (isRepost) {
      return (
        <StatusInfo
          avatarSize={avatarSize}
          icon={<Icon src={require('@tabler/icons/outline/repeat.svg')} className='h-4 w-4 text-green-600' />}
          text={
            <FormattedMessage
              id='status.reposted_by'
              defaultMessage='{name} reposted'
              values={{
                name: (
                  <Link to={`/@${status.account.id}`} className='hover:underline'>
                    <bdi className='truncate'>
                      <strong
                        className='text-gray-800 dark:text-gray-200'
                        dangerouslySetInnerHTML={{
                          __html: status.account.display_name,
                        }}
                      />
                    </bdi>
                  </Link>
                ),
              }}
            />
          }
        />
      );
    } else if (featured) {
      return (
        <StatusInfo
          avatarSize={avatarSize}
          icon={<Icon src={require('@tabler/icons/outline/pinned.svg')} className='h-4 w-4 text-gray-600 dark:text-gray-400' />}
          text={
            <FormattedMessage id='status.pinned' defaultMessage='Pinned post' />
          }
        />
      );
    } else if (showGroup && group) {
      return (
        <StatusInfo
          avatarSize={avatarSize}
          icon={<Icon src={require('@tabler/icons/outline/circles.svg')} className='h-4 w-4 text-primary-600 dark:text-accent-blue' />}
          text={
            <FormattedMessage
              id='status.group'
              defaultMessage='Posted in {group}'
              values={{
                group: (
                  <Link to={`/group/${group.slug}`} className='hover:underline'>
                    <bdi className='truncate'>
                      <strong className='text-gray-800 dark:text-gray-200'>
                        <span dangerouslySetInnerHTML={{ __html: group.display_name_html }} />
                      </strong>
                    </bdi>
                  </Link>
                ),
              }}
            />
          }
        />
      );
    }
  };

  if (!status) return null;

  if (hidden) {
    return (
      <div ref={node}>
        <>
          {actualStatus.account.display_name || actualStatus.account.username}
          {actualStatus.content}
        </>
      </div>
    );
  }

  if (filtered && status.showFiltered) {
    const minHandlers = muted ? undefined : {
      moveUp: handleHotkeyMoveUp,
      moveDown: handleHotkeyMoveDown,
    };

    return (
      <HotKeys handlers={minHandlers}>
        <div className={clsx('status__wrapper text-center', { focusable })} tabIndex={focusable ? 0 : undefined} ref={node}>
          <Text theme='muted'>
            <FormattedMessage id='status.filtered' defaultMessage='Filtered' />: {status.filtered.join(', ')}.
            {' '}
            <button className='text-primary-600 hover:underline dark:text-accent-blue' onClick={handleUnfilter}>
              <FormattedMessage id='status.show_filter_reason' defaultMessage='Show anyway' />
            </button>
          </Text>
        </div>
      </HotKeys>
    );
  }

  let repostedByText;
  if (status.repost && typeof status.repost === 'object') {
    repostedByText = intl.formatMessage(
      messages.reposted_by,
      { name: status.account.id },
    );
  }

  let quote;

  if (actualStatus.quote) {
    quote = <QuotedStatus statusId={actualStatus.quote as string} />;
  }

  const handlers = muted ? undefined : {
    reply: handleHotkeyReply,
    like: handleHotkeyLike,
    boost: handleHotkeyBoost,
    mention: handleHotkeyMention,
    open: handleHotkeyOpen,
    openProfile: handleHotkeyOpenProfile,
    moveUp: handleHotkeyMoveUp,
    moveDown: handleHotkeyMoveDown,
    toggleHidden: handleHotkeyToggleHidden,
    toggleSensitive: handleHotkeyToggleSensitive,
    openMedia: handleHotkeyOpenMedia,
    react: handleHotkeyReact,
  };

  const isUnderReview = actualStatus.visibility === 'self';
  const isSensitive = actualStatus.hidden;

  return (
    <HotKeys handlers={handlers} data-testid='status'>
      <div
        className={clsx('status cursor-pointer', { focusable })}
        tabIndex={focusable && !muted ? 0 : undefined}
        data-featured={featured ? 'true' : null}
        aria-label={textForScreenReader(intl, actualStatus, repostedByText)}
        ref={node}
        onClick={handleClick}
        role='link'
      >
        <Card
          variant={variant}
          className={clsx('status__wrapper space-y-4', `status-${actualStatus.visibility}`, {
            'py-6 sm:p-5': variant === 'rounded',
            'status-reply': !!status.in_reply_to_id,
            muted,
            read: unread === false,
          })}
          data-id={status.id}
        >
          {renderStatusInfo()}

          <AccountContainer
            key={actualStatus.account.id}
            id={actualStatus.account.id}
            timestamp={actualStatus.created_at}
            timestampUrl={statusUrl}
            action={accountAction}
            hideActions={!accountAction}
            showEdit={!!actualStatus.edited_at}
            showProfileHoverCard={hoverable}
            withLinkToProfile={hoverable}
            approvalStatus={actualStatus.approval_status}
            avatarSize={avatarSize}
          />

          <div className='status__content-wrapper'>
            <StatusReplyMentions status={actualStatus} hoverable={hoverable} />

            <Stack
              className='relative z-0'
              style={{ minHeight: isUnderReview || isSensitive ? Math.max(minHeight, 208) + 12 : undefined }}
            >
              {(isUnderReview || isSensitive) && (
                <SensitiveContentOverlay
                  status={status}
                  visible={showMedia}
                  onToggleVisibility={handleToggleMediaVisibility}
                  ref={overlay}
                />
              )}

              <Stack space={4}>
                <StatusContent
                  status={actualStatus}
                  onClick={handleClick}
                  collapsable
                  translatable
                />

                {(quote || actualStatus.card || actualStatus.media_attachments.size > 0) && (
                  <Stack space={4}>
                    <StatusMedia
                      status={actualStatus}
                      muted={muted}
                      onClick={handleClick}
                      showMedia={showMedia}
                      onToggleVisibility={handleToggleMediaVisibility}
                    />

                    {quote}
                  </Stack>
                )}
              </Stack>
            </Stack>

            {(!hideActionBar && !isUnderReview) && (
              <div className='pt-4'>
                <StatusActionBar status={actualStatus} />
              </div>
            )}
          </div>
        </Card>
      </div >
    </HotKeys >
  );
};

export default Status;
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { List as ImmutableList } from 'immutable';
import { nip19 } from 'nostr-tools';
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { blockAccount, pinAccount, removeFromFollowers, unblockAccount, unmuteAccount, unpinAccount } from 'src/actions/accounts';
import { mentionCompose, directCompose } from 'src/actions/compose';
import { openModal } from 'src/actions/modals';
import { initMuteModal } from 'src/actions/mutes';
import { initReport, ReportableEntities } from 'src/actions/reports';
import { setSearchAccount } from 'src/actions/search';
import { getSettings } from 'src/actions/settings';
import { useFollow } from 'src/api/hooks';
import DropdownMenu, { Menu } from 'src/components/dropdown-menu';
import { ActionButton, Badge, HStack, IconButton, MovedNote, StillImage, VerificationBadge } from 'src/components';
import { useAppDispatch, useAppSelector, useOwnAccount } from 'src/hooks';
import { normalizeAttachment } from 'src/normalizers';
import { ChatKeys, useChats } from 'src/queries/chats';
import { queryClient } from 'src/queries/client';
import { Account } from 'src/schemas';
import toast from 'src/toast';
import { isDefaultHeader } from 'src/utils/accounts';
import copy from 'src/utils/copy';
import Avatar from './Avatar';

const messages = defineMessages({
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  mention: { id: 'account.mention', defaultMessage: 'Mention' },
  chat: { id: 'account.chat', defaultMessage: 'Chat with @{name}' },
  direct: { id: 'account.direct', defaultMessage: 'Direct message @{name}' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  report: { id: 'account.report', defaultMessage: 'Report @{name}' },
  copy: { id: 'account.copy', defaultMessage: 'Copy link to profile' },
  share: { id: 'account.share', defaultMessage: 'Share @{name}\'s profile' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  hideReposts: { id: 'account.hide_reblogs', defaultMessage: 'Hide reposts from @{name}' },
  showReposts: { id: 'account.show_reblogs', defaultMessage: 'Show reposts from @{name}' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocks' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Mutes' },
  endorse: { id: 'account.endorse', defaultMessage: 'Feature on profile' },
  unendorse: { id: 'account.unendorse', defaultMessage: 'Don\'t feature on profile' },
  removeFromFollowers: { id: 'account.remove_from_followers', defaultMessage: 'Remove this follower' },
  adminAccount: { id: 'status.admin_account', defaultMessage: 'Moderate @{name}' },
  add_or_remove_from_list: { id: 'account.add_or_remove_from_list', defaultMessage: 'Add or Remove from lists' },
  search: { id: 'account.search', defaultMessage: 'Search from @{name}' },
  searchSelf: { id: 'account.search_self', defaultMessage: 'Search your posts' },
  unfollowConfirm: { id: 'confirmations.unfollow.confirm', defaultMessage: 'Unfollow' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
  removeFromFollowersConfirm: { id: 'confirmations.remove_from_followers.confirm', defaultMessage: 'Remove' },
  profileExternal: { id: 'account.profile_external', defaultMessage: 'View profile on {domain}' },
  header: { id: 'account.header.alt', defaultMessage: 'Profile header' },
});

interface IHeader {
  account?: Account;
}

const Header: React.FC<IHeader> = ({ account }) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { account: ownAccount } = useOwnAccount();
  const { follow } = useFollow();

  const { getOrCreateChatByAccountId } = useChats();

  const createAndNavigateToChat = useMutation({
    mutationFn: (accountId: string) => getOrCreateChatByAccountId(accountId),
    onError: (error: AxiosError) => {
      const data = error.response?.data as any;
      toast.error(data?.error);
    },
    onSuccess: (response) => {
      history.push(`/chats/${response.data.id}`);
      queryClient.invalidateQueries({
        queryKey: ChatKeys.chatSearch(),
      });
    },
  });

  if (!account) {
    return (
      <div className='-mx-4 -mt-4 sm:-mx-6 sm:-mt-6'>
        <div>
          <div className='relative h-32 w-full bg-gray-200 black:rounded-t-none md:rounded-t-xl lg:h-48 dark:bg-gray-900/50' />
        </div>

        <div className='px-4 sm:px-6'>
          <HStack alignItems='bottom' space={5} className='-mt-12'>
            <div className='relative flex'>
              <div
                className='h-24 w-24 rounded-full bg-gray-400 ring-4 ring-white dark:ring-gray-800'
              />
            </div>
          </HStack>
        </div>
      </div>
    );
  }

  const onBlock = () => {
    if (account.relationship?.blocking) {
      dispatch(unblockAccount(account.id));
    } else {
      dispatch(openModal('CONFIRM', {
        icon: require('@tabler/icons/outline/ban.svg'),
        heading: <FormattedMessage id='confirmations.block.heading' defaultMessage='Block @{name}' values={{ name: account.username }} />,
        message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong className='break-words'>@{account.username}</strong> }} />,
        confirm: intl.formatMessage(messages.blockConfirm),
        onConfirm: () => dispatch(blockAccount(account.id)),
        secondary: intl.formatMessage(messages.blockAndReport),
        onSecondary: () => {
          dispatch(blockAccount(account.id));
          dispatch(initReport(ReportableEntities.ACCOUNT, account));
        },
      }));
    }
  };

  const onMention = () => {
    dispatch(mentionCompose(account));
  };

  const onDirect = () => {
    dispatch(directCompose(account));
  };

  const onRepostToggle = () => {
    if (account.relationship?.showing_reposts) {
      follow(account.id, { reposts: false });
    } else {
      follow(account.id, { reposts: true });
    }
  };

  const onReport = () => {
    dispatch(initReport(ReportableEntities.ACCOUNT, account));
  };

  const onMute = () => {
    if (account.relationship?.muting) {
      dispatch(unmuteAccount(account.id));
    } else {
      dispatch(initMuteModal(account));
    }
  };

  const onModerate = () => {
    dispatch(openModal('ACCOUNT_MODERATION', { accountId: account.id }));
  };

  const onRemoveFromFollowers = () => {
    dispatch((_, getState) => {
      const unfollowModal = getSettings(getState()).get('unfollowModal');
      if (unfollowModal) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.remove_from_followers.message' defaultMessage='Are you sure you want to remove {name} from your followers?' values={{ name: <strong className='break-words'>@{account.username}</strong> }} />,
          confirm: intl.formatMessage(messages.removeFromFollowersConfirm),
          onConfirm: () => dispatch(removeFromFollowers(account.id)),
        }));
      } else {
        dispatch(removeFromFollowers(account.id));
      }
    });
  };

  const onSearch = () => {
    dispatch(setSearchAccount(account.id));
    history.push('/search');
  };

  const onAvatarClick = () => {
    const avatar = normalizeAttachment({
      type: 'image',
      url: account.avatar,
    });
    dispatch(openModal('MEDIA', { media: ImmutableList.of(avatar), index: 0 }));
  };

  const handleAvatarClick: React.MouseEventHandler = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onAvatarClick();
    }
  };

  const onHeaderClick = () => {
    const header = normalizeAttachment({
      type: 'image',
      url: account.header,
    });
    dispatch(openModal('MEDIA', { media: ImmutableList.of(header), index: 0 }));
  };

  const handleHeaderClick: React.MouseEventHandler = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onHeaderClick();
    }
  };

  const handleShare = () => {
    navigator.share({
      text: `@${account.username}`,
      url: account.url,
    }).catch((e) => {
      if (e.name !== 'AbortError') console.error(e);
    });
  };

  const handleCopy: React.EventHandler<React.MouseEvent> = (e) => {
    copy(account.url);
  };

  const makeMenu = () => {
    const menu: Menu = [];

    if (!account) {
      return [];
    }

    if ('share' in navigator) {
      menu.push({
        text: intl.formatMessage(messages.share, { name: account.username }),
        action: handleShare,
        icon: require('@tabler/icons/outline/upload.svg'),
      });
    }

    menu.push({
      text: intl.formatMessage(messages.copy),
      action: handleCopy,
      icon: require('@tabler/icons/outline/clipboard-copy.svg'),
    });

    if (!ownAccount) return menu;

    menu.push({
      text: intl.formatMessage(account.id === ownAccount.id ? messages.searchSelf : messages.search, { name: account.username }),
      action: onSearch,
      icon: require('@tabler/icons/outline/search.svg'),
    });

    if (menu.length) {
      menu.push(null);
    }

    if (account.id === ownAccount.id) {
      menu.push({
        text: intl.formatMessage(messages.edit_profile),
        to: '/settings/profile',
        icon: require('@tabler/icons/outline/user.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.preferences),
        to: '/settings',
        icon: require('@tabler/icons/outline/settings.svg'),
      });
      menu.push(null);
      menu.push({
        text: intl.formatMessage(messages.mutes),
        to: '/mutes',
        icon: require('@tabler/icons/outline/circle-x.svg'),
      });
      menu.push({
        text: intl.formatMessage(messages.blocks),
        to: '/blocks',
        icon: require('@tabler/icons/outline/ban.svg'),
      });
    } else {
      menu.push({
        text: intl.formatMessage(messages.mention, { name: account.username }),
        action: onMention,
        icon: require('@tabler/icons/outline/at.svg'),
      });

      menu.push({
        text: intl.formatMessage(messages.direct, { name: account.username }),
        action: onDirect,
        icon: require('@tabler/icons/outline/mail.svg'),
      });

      if (account.relationship?.following) {
        if (account.relationship?.showing_reposts) {
          menu.push({
            text: intl.formatMessage(messages.hideReposts, { name: account.username }),
            action: onRepostToggle,
            icon: require('@tabler/icons/outline/repeat.svg'),
          });
        } else {
          menu.push({
            text: intl.formatMessage(messages.showReposts, { name: account.username }),
            action: onRepostToggle,
            icon: require('@tabler/icons/outline/repeat.svg'),
          });
        }
      }

      menu.push(null);

      if (account.relationship?.followed_by) {
        menu.push({
          text: intl.formatMessage(messages.removeFromFollowers),
          action: onRemoveFromFollowers,
          icon: require('@tabler/icons/outline/user-x.svg'),
        });
      }

      if (account.relationship?.muting) {
        menu.push({
          text: intl.formatMessage(messages.unmute, { name: account.username }),
          action: onMute,
          icon: require('@tabler/icons/outline/circle-x.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.mute, { name: account.username }),
          action: onMute,
          icon: require('@tabler/icons/outline/circle-x.svg'),
        });
      }

      if (account.relationship?.blocking) {
        menu.push({
          text: intl.formatMessage(messages.unblock, { name: account.username }),
          action: onBlock,
          icon: require('@tabler/icons/outline/ban.svg'),
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.block, { name: account.username }),
          action: onBlock,
          icon: require('@tabler/icons/outline/ban.svg'),
        });
      }

      menu.push({
        text: intl.formatMessage(messages.report, { name: account.username }),
        action: onReport,
        icon: require('@tabler/icons/outline/flag.svg'),
      });
    }

    if (ownAccount.staff) {
      menu.push(null);

      menu.push({
        text: intl.formatMessage(messages.adminAccount, { name: account.username }),
        action: onModerate,
        icon: require('@tabler/icons/outline/gavel.svg'),
      });
    }

    return menu;
  };

  const makeInfo = () => {
    const info: React.ReactNode[] = [];

    if (!account || !ownAccount) return info;

    if (ownAccount.id !== account.id && account.relationship?.followed_by) {
      info.push(
        <Badge
          key='followed_by'
          slug='opaque'
          title={<FormattedMessage id='account.follows_you' defaultMessage='Follows you' />}
        />,
      );
    } else if (ownAccount.id !== account.id && account.relationship?.blocking) {
      info.push(
        <Badge
          key='blocked'
          slug='opaque'
          title={<FormattedMessage id='account.blocked' defaultMessage='Blocked' />}
        />,
      );
    }

    if (ownAccount.id !== account.id && account.relationship?.muting) {
      info.push(
        <Badge
          key='muted'
          slug='opaque'
          title={<FormattedMessage id='account.muted' defaultMessage='Muted' />}
        />,
      );
    }

    return info;
  };

  const renderHeader = () => {
    let header: React.ReactNode;

    if (account.header) {
      header = (
        <StillImage
          src={account.header}
          alt={intl.formatMessage(messages.header)}
        />
      );

      if (!isDefaultHeader(account.header)) {
        header = (
          <a href={account.header} onClick={handleHeaderClick} target='_blank'>
            {header}
          </a>
        );
      }
    }

    return header;
  };

  const renderMessageButton = () => {
    if (!ownAccount || !account || account.id === ownAccount?.id) {
      return null;
    }

    if (account.accepts_chat_messages) {
      return (
        <IconButton
          src={require('@tabler/icons/outline/messages.svg')}
          onClick={() => createAndNavigateToChat.mutate(account.id)}
          title={intl.formatMessage(messages.chat, { name: account.username })}
          theme='outlined'
          className='px-2'
          iconClassName='h-4 w-4'
        />
      );
    } else {
      return null;
    }
  };

  const renderShareButton = () => {
    const canShare = 'share' in navigator;

    if (!(account && ownAccount?.id && account.id === ownAccount?.id && canShare)) {
      return null;
    }

    return (
      <IconButton
        src={require('@tabler/icons/outline/upload.svg')}
        onClick={handleShare}
        title={intl.formatMessage(messages.share, { name: account.username })}
        theme='outlined'
        className='px-2'
        iconClassName='h-4 w-4'
      />
    );
  };

  const info = makeInfo();
  const menu = makeMenu();

  return (
    <div className='-mx-4 -mt-4 sm:-mx-6 sm:-mt-6'>
      {(account.moved && typeof account.moved === 'object') && (
        <MovedNote from={account} to={account.moved as Account} />
      )}

      <div>
        <div className='relative isolate flex h-32 w-full flex-col justify-center overflow-hidden bg-gray-200 black:rounded-t-none md:rounded-t-xl lg:h-48 dark:bg-gray-900/50'>
          {renderHeader()}

          <div className='absolute left-2 top-2'>
            <HStack alignItems='center' space={1}>
              {info}
            </HStack>
          </div>
        </div>
      </div>

      <div className='px-4 sm:px-6'>
        <HStack className='-mt-12' alignItems='bottom' space={5}>
          <div className='relative flex'>
            <a href={account.avatar} onClick={handleAvatarClick} target='_blank'>
              <Avatar
                src={account.avatar}
                size={96}
                className='relative h-24 w-24 rounded-full bg-white ring-4 ring-white dark:bg-primary-900 dark:ring-primary-900'
              />
            </a>
            {account.verified && (
              <div className='absolute bottom-0 right-0'>
                <VerificationBadge className='h-6 w-6 rounded-full bg-white ring-2 ring-white dark:bg-primary-900 dark:ring-primary-900' />
              </div>
            )}
          </div>

          <div className='mt-6 flex w-full justify-end sm:pb-1'>
            <HStack space={2} className='mt-10'>
              {renderMessageButton()}
              {renderShareButton()}

              {menu.length > 0 && (
                <DropdownMenu items={menu} placement='bottom-end'>
                  <IconButton
                    src={require('@tabler/icons/outline/dots.svg')}
                    theme='outlined'
                    className='px-2'
                    iconClassName='h-4 w-4'
                    children={null}
                  />
                </DropdownMenu>
              )}

              <ActionButton account={account} />
            </HStack>
          </div>
        </HStack>
      </div>
    </div>
  );
};

export default Header;
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { blockAccount } from 'src/actions/accounts';
// import { launchChat } from 'src/actions/chats';
import { directCompose, mentionCompose, quoteCompose, replyCompose } from 'src/actions/compose';
import { pinToGroup, toggleBookmark, toggleLike, togglePin, toggleRepost, unpinFromGroup } from 'src/actions/interactions';
import { openModal } from 'src/actions/modals';
import { deleteStatusModal, toggleStatusSensitivityModal } from 'src/actions/moderation';
import { initMuteModal } from 'src/actions/mutes';
import { initReport, ReportableEntities } from 'src/actions/reports';
import { deleteStatus, editStatus, toggleMuteStatus } from 'src/actions/statuses';
import { deleteFromTimelines } from 'src/actions/timelines';
import { useBlockGroupMember, useDeleteGroupStatus, useGroup, useGroupRelationship, useMuteGroup, useUnmuteGroup } from 'src/api/hooks';
import DropdownMenu from 'src/components/dropdown-menu';
import { GroupPopover, StatusActionButton, HStack } from 'src/components';
import { useAppDispatch, useAppSelector, useOwnAccount, useSettings, useApolloConfig } from 'src/hooks';
import { GroupRoles } from 'src/schemas/group-member';
import toast from 'src/toast';
import copy from 'src/utils/copy';

import type { Menu } from 'src/components/dropdown-menu';
import type { Group, Status } from 'src/types/entities';

const messages = defineMessages({
  adminAccount: { id: 'status.admin_account', defaultMessage: 'Moderate @{name}' },
  admin_status: { id: 'status.admin_status', defaultMessage: 'Open this post in the moderation interface' },
  block: { id: 'account.block', defaultMessage: 'Block @t@{name}' },
  blocked: { id: 'group.group_mod_block.success', defaultMessage: '@{name} is banned' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  bookmark: { id: 'status.bookmark', defaultMessage: 'Bookmark' },
  cancel_repost_private: { id: 'status.cancel_repost_private', defaultMessage: 'Un-repost' },
  cannot_repost: { id: 'status.cannot_repost', defaultMessage: 'This post cannot be reposted' },
  chat: { id: 'status.chat', defaultMessage: 'Chat with @{name}' },
  copy: { id: 'status.copy', defaultMessage: 'Copy Link to Post' },
  deactivateUser: { id: 'admin.users.actions.deactivate_user', defaultMessage: 'Deactivate @{name}' },
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteFromGroupMessage: { id: 'confirmations.delete_from_group.message', defaultMessage: 'Are you sure you want to delete @{name}\'s post?' },
  deleteHeading: { id: 'confirmations.delete.heading', defaultMessage: 'Delete post' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this post?' },
  deleteStatus: { id: 'admin.statuses.actions.delete_status', defaultMessage: 'Delete post' },
  deleteUser: { id: 'admin.users.actions.delete_user', defaultMessage: 'Delete @{name}' },
  direct: { id: 'status.direct', defaultMessage: 'Direct message @{name}' },
  edit: { id: 'status.edit', defaultMessage: 'Edit' },
  // embed: { id: 'status.embed', defaultMessage: 'Embed post' },
  like: { id: 'status.like', defaultMessage: 'Like' },
  groupBlockConfirm: { id: 'confirmations.block_from_group.confirm', defaultMessage: 'Ban User' },
  groupBlockFromGroupHeading: { id: 'confirmations.block_from_group.heading', defaultMessage: 'Ban From Group' },
  groupBlockFromGroupMessage: { id: 'confirmations.block_from_group.message', defaultMessage: 'Are you sure you want to ban @{name} from the group?' },
  groupModDelete: { id: 'status.group_mod_delete', defaultMessage: 'Delete post from group' },
  group_remove_account: { id: 'status.remove_account_from_group', defaultMessage: 'Remove account from group' },
  group_remove_post: { id: 'status.remove_post_from_group', defaultMessage: 'Remove post from group' },
  markStatusNotSensitive: { id: 'admin.statuses.actions.mark_status_not_sensitive', defaultMessage: 'Mark post not sensitive' },
  markStatusSensitive: { id: 'admin.statuses.actions.mark_status_sensitive', defaultMessage: 'Mark post sensitive' },
  mention: { id: 'status.mention', defaultMessage: 'Mention @{name}' },
  more: { id: 'status.more', defaultMessage: 'More' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  muteConfirm: { id: 'confirmations.mute_group.confirm', defaultMessage: 'Mute' },
  muteConversation: { id: 'status.mute_conversation', defaultMessage: 'Mute Conversation' },
  muteGroup: { id: 'group.mute.long_label', defaultMessage: 'Mute Group' },
  muteHeading: { id: 'confirmations.mute_group.heading', defaultMessage: 'Mute Group' },
  muteMessage: { id: 'confirmations.mute_group.message', defaultMessage: 'You are about to mute the group. Do you want to continue?' },
  muteSuccess: { id: 'group.mute.success', defaultMessage: 'Muted the group' },
  open: { id: 'status.open', defaultMessage: 'Show Post Details' },
  pin: { id: 'status.pin', defaultMessage: 'Pin on profile' },
  pinToGroup: { id: 'status.pin_to_group', defaultMessage: 'Pin to Group' },
  pinToGroupSuccess: { id: 'status.pin_to_group.success', defaultMessage: 'Pinned to Group!' },
  quotePost: { id: 'status.quote', defaultMessage: 'Quote post' },
  repost: { id: 'status.repost', defaultMessage: 'Repost' },
  repost_private: { id: 'status.repost_private', defaultMessage: 'Repost to original audience' },
  redraft: { id: 'status.redraft', defaultMessage: 'Delete & re-draft' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftHeading: { id: 'confirmations.redraft.heading', defaultMessage: 'Delete & redraft' },
  redraftMessage: { id: 'confirmations.redraft.message', defaultMessage: 'Are you sure you want to delete this post and re-draft it? Likes and reposts will be lost, and replies to the original post will be orphaned.' },
  replies_disabled_group: { id: 'status.disabled_replies.group_membership', defaultMessage: 'Only group members can reply' },
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  replyAll: { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  report: { id: 'status.report', defaultMessage: 'Report @{name}' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  unbookmark: { id: 'status.unbookmark', defaultMessage: 'Remove bookmark' },
  unmuteConversation: { id: 'status.unmute_conversation', defaultMessage: 'Unmute Conversation' },
  unmuteGroup: { id: 'group.unmute.long_label', defaultMessage: 'Unmute Group' },
  unmuteSuccess: { id: 'group.unmute.success', defaultMessage: 'Unmuted the group' },
  unpin: { id: 'status.unpin', defaultMessage: 'Unpin from profile' },
  unpinFromGroup: { id: 'status.unpin_to_group', defaultMessage: 'Unpin from Group' },
  zap: { id: 'status.zap', defaultMessage: 'Zap' },
});

interface IStatusActionBar {
  status: Status;
  withLabels?: boolean;
  expandable?: boolean;
  space?: 'sm' | 'md' | 'lg';
  statusActionButtonTheme?: 'default' | 'inverse';
}

const StatusActionBar: React.FC<IStatusActionBar> = ({
  status,
  withLabels = false,
  expandable = true,
  space = 'sm',
  statusActionButtonTheme = 'default',
}) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const match = useRouteMatch<{ groupSlug: string }>('/group/:groupSlug');

  const { group } = useGroup((status.group as Group)?.id as string);
  const muteGroup = useMuteGroup(group as Group);
  const unmuteGroup = useUnmuteGroup(group as Group);
  const isMutingGroup = !!group?.relationship?.muting;
  const deleteGroupStatus = useDeleteGroupStatus(group as Group, status.id);
  const blockGroupMember = useBlockGroupMember(group as Group, status.account);

  const me = useAppSelector(state => state.me);
  const { groupRelationship } = useGroupRelationship(status.group?.id);
  const { boostModal, deleteModal } = useSettings();
  const apolloConfig = useApolloConfig();

  // const { allowedEmoji } = apolloConfig;

  const { account } = useOwnAccount();
  const isStaff = account ? account.staff : false;
  const isAdmin = account ? account.admin : false;

  if (!status) {
    return null;
  }

  const onOpenUnauthorizedModal = (action?: string) => {
    dispatch(openModal('UNAUTHORIZED', {
      action,
      ap_id: status.url,
    }));
  };

  const handleReplyClick: React.MouseEventHandler = (e) => {
    if (me) {
      dispatch(replyCompose(status));
    } else {
      onOpenUnauthorizedModal('REPLY');
    }
  };

  const handleShareClick = () => {
    navigator.share({
      text: status.search_index,
      url: status.uri,
    }).catch((e) => {
      if (e.name !== 'AbortError') console.error(e);
    });
  };

  const handleLikeClick: React.EventHandler<React.MouseEvent> = (e) => {
    if (me) {
      dispatch(toggleLike(status));
    } else {
      onOpenUnauthorizedModal('LIKE');
    }
  };

  const handleBookmarkClick: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(toggleBookmark(status));
  };

  const handleExternalClick = () => {
    window.open(status.uri, '_blank');
  };

  const handleRepostClick: React.EventHandler<React.MouseEvent> = e => {
    if (me) {
      const modalRepost = () => dispatch(toggleRepost(status));
      if ((e && e.shiftKey) || !boostModal) {
        modalRepost();
      } else {
        dispatch(openModal('BOOST', { status, onRepost: modalRepost }));
      }
    } else {
      onOpenUnauthorizedModal('REPOST');
    }
  };

  const handleQuoteClick: React.EventHandler<React.MouseEvent> = (e) => {
    if (me) {
      dispatch(quoteCompose(status));
    } else {
      onOpenUnauthorizedModal('REPOST');
    }
  };

  const doDeleteStatus = (withRedraft = false) => {
    dispatch((_, getState) => {
      if (!deleteModal) {
        dispatch(deleteStatus(status.id, withRedraft));
      } else {
        dispatch(openModal('CONFIRM', {
          icon: withRedraft ? require('@tabler/icons/outline/edit.svg') : require('@tabler/icons/outline/trash.svg'),
          heading: intl.formatMessage(withRedraft ? messages.redraftHeading : messages.deleteHeading),
          message: intl.formatMessage(withRedraft ? messages.redraftMessage : messages.deleteMessage),
          confirm: intl.formatMessage(withRedraft ? messages.redraftConfirm : messages.deleteConfirm),
          onConfirm: () => dispatch(deleteStatus(status.id, withRedraft)),
        }));
      }
    });
  };

  const handleDeleteClick: React.EventHandler<React.MouseEvent> = (e) => {
    doDeleteStatus();
  };

  const handleRedraftClick: React.EventHandler<React.MouseEvent> = (e) => {
    doDeleteStatus(true);
  };

  const handleEditClick: React.EventHandler<React.MouseEvent> = () => {
    dispatch(editStatus(status.id));
  };

  const handlePinClick: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(togglePin(status));
  };

  const handleGroupPinClick: React.EventHandler<React.MouseEvent> = () => {
    const group = status.group as Group;

    if (status.pinned) {
      dispatch(unpinFromGroup(status, group));
    } else {
      dispatch(pinToGroup(status, group))
        .then(() => toast.success(intl.formatMessage(messages.pinToGroupSuccess)))
        .catch(() => null);
    }
  };

  const handleMentionClick: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(mentionCompose(status.account));
  };

  const handleDirectClick: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(directCompose(status.account));
  };

  /* TODO: Implement chats
  const handleChatClick: React.EventHandler<React.MouseEvent> = (e) => {
    const account = status.account;
    dispatch(launchChat(account.id, history));
  };
  */

  const handleMuteClick: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(initMuteModal(status.account));
  };

  const handleMuteGroupClick: React.EventHandler<React.MouseEvent> = () =>
    dispatch(openModal('CONFIRM', {
      heading: intl.formatMessage(messages.muteHeading),
      message: intl.formatMessage(messages.muteMessage),
      confirm: intl.formatMessage(messages.muteConfirm),
      confirmationTheme: 'primary',
      onConfirm: () => muteGroup.mutate(undefined, {
        onSuccess() {
          toast.success(intl.formatMessage(messages.muteSuccess));
        },
      }),
    }));

  const handleUnmuteGroupClick: React.EventHandler<React.MouseEvent> = () => {
    unmuteGroup.mutate(undefined, {
      onSuccess() {
        toast.success(intl.formatMessage(messages.unmuteSuccess));
      },
    });
  };

  const handleBlockClick: React.EventHandler<React.MouseEvent> = (e) => {
    const account = status.account;

    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/outline/ban.svg'),
      heading: <FormattedMessage id='confirmations.block.heading' defaultMessage='Block @{name}' values={{ name: account.username }} />,
      message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong className='break-words'>@{account.username}</strong> }} />,
      confirm: intl.formatMessage(messages.blockConfirm),
      onConfirm: () => dispatch(blockAccount(account.id)),
      secondary: intl.formatMessage(messages.blockAndReport),
      onSecondary: () => {
        dispatch(blockAccount(account.id));
        dispatch(initReport(ReportableEntities.STATUS, account, { status }));
      },
    }));
  };

  const handleOpen: React.EventHandler<React.MouseEvent> = (e) => {
    history.push(`/@${status.account.id}/posts/${status.id}`);
  };

  /* TODO: Implement embed
  const handleEmbed = () => {
    dispatch(openModal('EMBED', {
      url: status.url,
      onError: (error: any) => toast.showAlertForError(error),
    }));
  };
  */

  const handleReport: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(initReport(ReportableEntities.STATUS, status.account, { status }));
  };

  const handleConversationMuteClick: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(toggleMuteStatus(status));
  };

  const handleCopy: React.EventHandler<React.MouseEvent> = (e) => {
    const { uri } = status;

    copy(uri);
  };

  const onModerate: React.MouseEventHandler = (e) => {
    const account = status.account;
    dispatch(openModal('ACCOUNT_MODERATION', { accountId: account.id }));
  };

  const handleDeleteStatus: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(deleteStatusModal(intl, status.id));
  };

  const handleToggleStatusSensitivity: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(toggleStatusSensitivityModal(intl, status.id, status.sensitive));
  };

  const handleDeleteFromGroup: React.EventHandler<React.MouseEvent> = () => {
    const account = status.account;

    dispatch(openModal('CONFIRM', {
      heading: intl.formatMessage(messages.deleteHeading),
      message: intl.formatMessage(messages.deleteFromGroupMessage, { name: <strong className='break-words'>{account.username}</strong> }),
      confirm: intl.formatMessage(messages.deleteConfirm),
      onConfirm: () => {
        deleteGroupStatus.mutate(status.id, {
          onSuccess() {
            dispatch(deleteFromTimelines(status.id));
          },
        });
      },
    }));
  };

  const handleBlockFromGroup = () => {
    dispatch(openModal('CONFIRM', {
      heading: intl.formatMessage(messages.groupBlockFromGroupHeading),
      message: intl.formatMessage(messages.groupBlockFromGroupMessage, { name: status.account.username }),
      confirm: intl.formatMessage(messages.groupBlockConfirm),
      onConfirm: () => {
        blockGroupMember({ account_ids: [status.account.id] }, {
          onSuccess() {
            toast.success(intl.formatMessage(messages.blocked, { name: status.account.username }));
          },
        });
      },
    }));
  };

  const _makeMenu = (publicStatus: boolean) => {
    const mutingConversation = status.muted;
    const ownAccount = status.account.id === me;
    const username = status.account.username;
    const account = status.account;

    const menu: Menu = [];

    if (expandable) {
      menu.push({
        text: intl.formatMessage(messages.open),
        action: handleOpen,
        icon: require('@tabler/icons/outline/arrows-vertical.svg'),
      });
    }

    if (publicStatus) {
      menu.push({
        text: intl.formatMessage(messages.copy),
        action: handleCopy,
        icon: require('@tabler/icons/outline/clipboard-copy.svg'),
      });

      /*
        menu.push({
          text: intl.formatMessage(messages.embed),
          action: handleEmbed,
          icon: require('@tabler/icons/outline/share.svg'),
        });
        */
    }

    if (!me) {
      return menu;
    }

    const isGroupStatus = typeof status.group === 'object';
    if (isGroupStatus && !!status.group) {
      const isGroupOwner = groupRelationship?.role === GroupRoles.OWNER;

      if (isGroupOwner) {
        menu.push({
          text: intl.formatMessage(status.pinned ? messages.unpinFromGroup : messages.pinToGroup),
          action: handleGroupPinClick,
          icon: status.pinned ? require('@tabler/icons/outline/pinned-off.svg') : require('@tabler/icons/outline/pin.svg'),
        });
      }
    }

    menu.push({
      text: intl.formatMessage(status.bookmarked ? messages.unbookmark : messages.bookmark),
      action: handleBookmarkClick,
      icon: status.bookmarked ? require('@tabler/icons/outline/bookmark-off.svg') : require('@tabler/icons/outline/bookmark.svg'),
    });

    menu.push(null);

    menu.push({
      text: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation),
      action: handleConversationMuteClick,
      icon: mutingConversation ? require('@tabler/icons/outline/bell.svg') : require('@tabler/icons/outline/bell-off.svg'),
    });

    menu.push(null);

    if (ownAccount) {
      if (publicStatus) {
        menu.push({
          text: intl.formatMessage(status.pinned ? messages.unpin : messages.pin),
          action: handlePinClick,
          icon: status.pinned ? require('@tabler/icons/outline/pinned-off.svg') : require('@tabler/icons/outline/pin.svg'),
        });
      } else {
        if (status.visibility === 'private') {
          menu.push({
            text: intl.formatMessage(status.reposted ? messages.cancel_repost_private : messages.repost_private),
            action: handleRepostClick,
            icon: require('@tabler/icons/outline/repeat.svg'),
          });
        }
      }

      menu.push({
        text: intl.formatMessage(messages.delete),
        action: handleDeleteClick,
        icon: require('@tabler/icons/outline/trash.svg'),
        destructive: true,
      });
      /* TODO: Make edits be for Prime users
      menu.push({ 
        text: intl.formatMessage(messages.edit),
        action: handleEditClick,
        icon: require('@tabler/icons/outline/edit.svg'),
      });
      */
      menu.push({
        text: intl.formatMessage(messages.redraft),
        action: handleRedraftClick,
        icon: require('@tabler/icons/outline/edit.svg'),
        destructive: true,
      });
    } else {
      menu.push({
        text: intl.formatMessage(messages.mention, { name: username }),
        action: handleMentionClick,
        icon: require('@tabler/icons/outline/at.svg'),
      });

      /* TODO: Implement chats 
      menu.push({
        text: intl.formatMessage(messages.chat, { name: username }),
        action: handleChatClick,
        icon: require('@tabler/icons/outline/messages.svg'),
      });
      } else if (features.privacyScopes) {
      */
      menu.push({
        text: intl.formatMessage(messages.direct, { name: username }),
        action: handleDirectClick,
        icon: require('@tabler/icons/outline/mail.svg'),
      });
    }

    menu.push(null);
    menu.push({
      text: isMutingGroup ? intl.formatMessage(messages.unmuteGroup) : intl.formatMessage(messages.muteGroup),
      icon: require('@tabler/icons/outline/volume-3.svg'),
      action: isMutingGroup ? handleUnmuteGroupClick : handleMuteGroupClick,
    });
    menu.push(null);

    menu.push({
      text: intl.formatMessage(messages.mute, { name: username }),
      action: handleMuteClick,
      icon: require('@tabler/icons/outline/volume-3.svg'),
    });
    menu.push({
      text: intl.formatMessage(messages.block, { name: username }),
      action: handleBlockClick,
      icon: require('@tabler/icons/outline/ban.svg'),
    });
    menu.push({
      text: intl.formatMessage(messages.report, { name: username }),
      action: handleReport,
      icon: require('@tabler/icons/outline/flag.svg'),
    });

    if (isGroupStatus && !!status.group) {
      const group = status.group as Group;
      const account = status.account;
      const isGroupOwner = groupRelationship?.role === GroupRoles.OWNER;
      const isGroupAdmin = groupRelationship?.role === GroupRoles.ADMIN;
      const isStatusFromOwner = group.owner.id === account.id;

      const canBanUser = match?.isExact && (isGroupOwner || isGroupAdmin) && !isStatusFromOwner && !ownAccount;
      const canDeleteStatus = !ownAccount && (isGroupOwner || (isGroupAdmin && !isStatusFromOwner));

      if (canBanUser || canDeleteStatus) {
        menu.push(null);
      }

      if (canBanUser) {
        menu.push({
          text: 'Ban from Group',
          action: handleBlockFromGroup,
          icon: require('@tabler/icons/outline/ban.svg'),
          destructive: true,
        });
      }

      if (canDeleteStatus) {
        menu.push({
          text: intl.formatMessage(messages.groupModDelete),
          action: handleDeleteFromGroup,
          icon: require('@tabler/icons/outline/trash.svg'),
          destructive: true,
        });
      }
    }

    if (isStaff) {
      menu.push(null);

      menu.push({
        text: intl.formatMessage(messages.adminAccount, { name: username }),
        action: onModerate,
        icon: require('@tabler/icons/outline/gavel.svg'),
      });

      if (isAdmin) {
        menu.push({
          text: intl.formatMessage(messages.admin_status),
          href: `/pleroma/admin/#/statuses/${status.id}/`,
          icon: require('@tabler/icons/outline/pencil.svg'),
        });
      }

      menu.push({
        text: intl.formatMessage(status.sensitive === false ? messages.markStatusSensitive : messages.markStatusNotSensitive),
        action: handleToggleStatusSensitivity,
        icon: require('@tabler/icons/outline/alert-triangle.svg'),
      });

      if (!ownAccount) {
        menu.push({
          text: intl.formatMessage(messages.deleteStatus),
          action: handleDeleteStatus,
          icon: require('@tabler/icons/outline/trash.svg'),
          destructive: true,
        });
      }
    }

    return menu;
  };

  const publicStatus = ['public', 'unlisted', 'group'].includes(status.visibility);

  const replyCount = status.replies_count;
  const repostCount = status.reposts_count;
  const likeCount = status.likes_count;

  const menu = _makeMenu(publicStatus);
  let repostIcon = require('@tabler/icons/outline/repeat.svg');
  let replyTitle;
  let replyDisabled = false;

  if (status.visibility === 'direct') {
    repostIcon = require('@tabler/icons/outline/mail.svg');
  } else if (status.visibility === 'private') {
    repostIcon = require('@tabler/icons/outline/lock.svg');
  }

  if ((status.group as Group)?.membership_required && !groupRelationship?.member) {
    replyDisabled = true;
    replyTitle = intl.formatMessage(messages.replies_disabled_group);
  }

  const repostMenu = [{
    text: intl.formatMessage(status.reposted ? messages.cancel_repost_private : messages.repost),
    action: handleRepostClick,
    icon: require('@tabler/icons/outline/repeat.svg'),
  }, {
    text: intl.formatMessage(messages.quotePost),
    action: handleQuoteClick,
    icon: require('@tabler/icons/outline/quote.svg'),
  }];

  const repostButton = (
    <StatusActionButton
      icon={repostIcon}
      color='success'
      disabled={!publicStatus}
      title={!publicStatus ? intl.formatMessage(messages.cannot_repost) : intl.formatMessage(messages.repost)}
      active={status.reposted}
      onClick={handleRepostClick}
      count={repostCount}
      text={withLabels ? intl.formatMessage(messages.repost) : undefined}
      theme={statusActionButtonTheme}
    />
  );

  if (!status.in_reply_to_id) {
    replyTitle = intl.formatMessage(messages.reply);
  } else {
    replyTitle = intl.formatMessage(messages.replyAll);
  }

  const canShare = ('share' in navigator) && (status.visibility === 'public' || status.visibility === 'group');

  const spacing: {
    [key: string]: React.ComponentProps<typeof HStack>['space'];
  } = {
    'sm': 2,
    'md': 8,
    'lg': 0, // using justifyContent instead on the HStack
  };

  return (
    <HStack data-testid='status-action-bar'>
      <HStack
        justifyContent={space === 'lg' ? 'between' : undefined}
        space={spacing[space]}
        grow={space === 'lg'}
        onClick={e => e.stopPropagation()}
        alignItems='center'
      >
        <GroupPopover
          group={status.group as any}
          isEnabled={replyDisabled}
        >
          <StatusActionButton
            title={replyTitle}
            icon={require('@tabler/icons/outline/message-circle.svg')}
            onClick={handleReplyClick}
            count={replyCount}
            text={withLabels ? intl.formatMessage(messages.reply) : undefined}
            disabled={replyDisabled}
            theme={statusActionButtonTheme}
          />
        </GroupPopover>

        <DropdownMenu
          items={repostMenu}
          disabled={!publicStatus}
          onShiftClick={handleRepostClick}
        >
          {repostButton}
        </DropdownMenu>

        <StatusActionButton
          title={intl.formatMessage(messages.like)}
          icon={require('@tabler/icons/outline/heart.svg')}
          color='accent'
          filled
          onClick={handleLikeClick}
          // active={Boolean(meEmojiName)}
          count={likeCount}
          // text={withLabels ? meEmojiTitle : undefined}
          theme={statusActionButtonTheme}
        />

        {canShare && (
          <StatusActionButton
            title={intl.formatMessage(messages.share)}
            icon={require('@tabler/icons/outline/upload.svg')}
            onClick={handleShareClick}
            theme={statusActionButtonTheme}
          />
        )}

        <DropdownMenu items={menu} status={status}>
          <StatusActionButton
            title={intl.formatMessage(messages.more)}
            icon={require('@tabler/icons/outline/dots.svg')}
            theme={statusActionButtonTheme}
          />
        </DropdownMenu>
      </HStack>
    </HStack>
  );
};

export default StatusActionBar;

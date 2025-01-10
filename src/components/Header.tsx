import atIcon from "@tabler/icons/outline/at.svg";
import banIcon from "@tabler/icons/outline/ban.svg";
import circleXIcon from "@tabler/icons/outline/circle-x.svg";
import clipboardCopyIcon from "@tabler/icons/outline/clipboard-copy.svg";
import dotsIcon from "@tabler/icons/outline/dots.svg";
import flagIcon from "@tabler/icons/outline/flag.svg";
import gavelIcon from "@tabler/icons/outline/gavel.svg";
import mailIcon from "@tabler/icons/outline/mail.svg";
import messagesIcon from "@tabler/icons/outline/messages.svg";
import repeatIcon from "@tabler/icons/outline/repeat.svg";
import searchIcon from "@tabler/icons/outline/search.svg";
import settingsIcon from "@tabler/icons/outline/settings.svg";
import uploadIcon from "@tabler/icons/outline/upload.svg";
import userXIcon from "@tabler/icons/outline/user-x.svg";
import userIcon from "@tabler/icons/outline/user.svg";
import { useMutation } from "@tanstack/react-query";
import { List as ImmutableList } from "immutable";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import {
  blockAccount,
  removeFromFollowers,
  unblockAccount,
  unmuteAccount,
} from "src/actions/accounts";
import { mentionCompose, directCompose } from "src/actions/compose";
import { openModal } from "src/actions/modals";
import { initMuteModal } from "src/actions/mutes";
import { initReport, ReportableEntities } from "src/actions/reports";
import { setSearchAccount } from "src/actions/search";
import { getSettings } from "src/actions/settings";
import { HTTPError } from "src/api/HTTPError";
import { useFollow } from "src/api/hooks/index";
import Badge from "src/components/Badge";
import DropdownMenu, { Menu } from "src/components/dropdown-menu/index";
import StillImage from "src/components/StillImage";
import Avatar from "src/components/Avatar";
import HStack from "src/components/HStack";
import IconButton from "src/components/IconButton";
import VerificationBadge from "src/components/VerificationBadge";
import MovedNote from "src/components/MovedNote";
import ActionButton from "src/components/ActionButton";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { normalizeAttachment } from "src/normalizers/index";
import { ChatKeys, useChats } from "src/queries/chats";
import { queryClient } from "src/queries/client";
import { Account } from "src/schemas/index";
import toast from "src/toast";
import { isDefaultHeader } from "src/utils/accounts";
import copy from "src/utils/copy";

const messages = defineMessages({
  edit_profile: { id: "account.edit_profile", defaultMessage: "Edit profile" },
  linkVerifiedOn: {
    id: "account.link_verified_on",
    defaultMessage: "Ownership of this link was checked on {date}",
  },
  account_locked: {
    id: "account.locked_info",
    defaultMessage:
      "This account privacy status is set to locked. The owner manually reviews who can follow them.",
  },
  mention: { id: "account.mention", defaultMessage: "Mention" },
  chat: { id: "account.chat", defaultMessage: "Chat with @{name}" },
  direct: { id: "account.direct", defaultMessage: "Direct message @{name}" },
  unmute: { id: "account.unmute", defaultMessage: "Unmute @{name}" },
  block: { id: "account.block", defaultMessage: "Block @{name}" },
  unblock: { id: "account.unblock", defaultMessage: "Unblock @{name}" },
  mute: { id: "account.mute", defaultMessage: "Mute @{name}" },
  report: { id: "account.report", defaultMessage: "Report @{name}" },
  copy: { id: "account.copy", defaultMessage: "Copy link to profile" },
  npub: { id: "account.npub", defaultMessage: "Copy user npub" },
  share: { id: "account.share", defaultMessage: "Share @{name}'s profile" },
  media: { id: "account.media", defaultMessage: "Media" },
  blockDomain: {
    id: "account.block_domain",
    defaultMessage: "Hide everything from {domain}",
  },
  unblockDomain: {
    id: "account.unblock_domain",
    defaultMessage: "Unhide {domain}",
  },
  hideReposts: {
    id: "account.hide_reposts",
    defaultMessage: "Hide reposts from @{name}",
  },
  showReposts: {
    id: "account.show_reposts",
    defaultMessage: "Show reposts from @{name}",
  },
  preferences: {
    id: "navigation_bar.preferences",
    defaultMessage: "Preferences",
  },
  follow_requests: {
    id: "navigation_bar.follow_requests",
    defaultMessage: "Follow requests",
  },
  blocks: { id: "navigation_bar.blocks", defaultMessage: "Blocks" },
  domain_blocks: {
    id: "navigation_bar.domain_blocks",
    defaultMessage: "Domain blocks",
  },
  mutes: { id: "navigation_bar.mutes", defaultMessage: "Mutes" },
  endorse: { id: "account.endorse", defaultMessage: "Feature on profile" },
  unendorse: {
    id: "account.unendorse",
    defaultMessage: "Don't feature on profile",
  },
  removeFromFollowers: {
    id: "account.remove_from_followers",
    defaultMessage: "Remove this follower",
  },
  adminAccount: {
    id: "status.admin_account",
    defaultMessage: "Moderate @{name}",
  },
  add_or_remove_from_list: {
    id: "account.add_or_remove_from_list",
    defaultMessage: "Add or Remove from lists",
  },
  search: { id: "account.search", defaultMessage: "Search from @{name}" },
  searchSelf: {
    id: "account.search_self",
    defaultMessage: "Search your posts",
  },
  unfollowConfirm: {
    id: "confirmations.unfollow.confirm",
    defaultMessage: "Unfollow",
  },
  blockConfirm: { id: "confirmations.block.confirm", defaultMessage: "Block" },
  blockDomainConfirm: {
    id: "confirmations.domain_block.confirm",
    defaultMessage: "Hide entire domain",
  },
  blockAndReport: {
    id: "confirmations.block.block_and_report",
    defaultMessage: "Block & Report",
  },
  removeFromFollowersConfirm: {
    id: "confirmations.remove_from_followers.confirm",
    defaultMessage: "Remove",
  },
  userEndorsed: {
    id: "account.endorse.success",
    defaultMessage: "You are now featuring @{username} on your profile",
  },
  userUnendorsed: {
    id: "account.unendorse.success",
    defaultMessage: "You are no longer featuring @{username}",
  },
  profileExternal: {
    id: "account.profile_external",
    defaultMessage: "View profile on {domain}",
  },
  header: { id: "account.header.alt", defaultMessage: "Profile header" },
  subscribeFeed: {
    id: "account.rss_feed",
    defaultMessage: "Subscribe to RSS feed",
  },
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

  // const { getOrCreateChatByAccountId } = useChats();

  /* TODO: Implement chats

  const createAndNavigateToChat = useMutation({
    mutationFn: (accountId: string) => getOrCreateChatByAccountId(accountId),
    onError: (error) => {
      if (error instanceof HTTPError) {
        toast.showAlertForError(error);
      }
    },
    onSuccess: async (response) => {
      const data = await response.json();
      history.push(`/chats/${data.id}`);
      queryClient.invalidateQueries({
        queryKey: ChatKeys.chatSearch(),
      });
    },
  });

  */

  if (!account) {
    return (
      <div className="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
        <div>
          <div className="relative h-32 w-full bg-gray-200 black:rounded-t-none dark:bg-gray-900/50 md:rounded-t-xl lg:h-48" />
        </div>

        <div className="px-4 sm:px-6">
          <HStack alignItems="bottom" space={5} className="-mt-12">
            <div className="relative flex">
              <div className="size-24 rounded-5px bg-gray-400 ring-4 ring-white dark:ring-gray-800" />
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
      dispatch(
        openModal("CONFIRM", {
          icon: banIcon,
          heading: (
            <FormattedMessage
              id="confirmations.block.heading"
              defaultMessage="Block @{name}"
              values={{ name: account.username }}
            />
          ),
          message: (
            <FormattedMessage
              id="confirmations.block.message"
              defaultMessage="Are you sure you want to block {name}?"
              values={{
                name: (
                  <strong className="break-words">@{account.username}</strong>
                ),
              }}
            />
          ), // eslint-disable-line formatjs/no-literal-string-in-jsx
          confirm: intl.formatMessage(messages.blockConfirm),
          onConfirm: () => dispatch(blockAccount(account.id)),
          secondary: intl.formatMessage(messages.blockAndReport),
          onSecondary: () => {
            dispatch(blockAccount(account.id));
            dispatch(initReport(ReportableEntities.ACCOUNT, account));
          },
        })
      );
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
    dispatch(openModal("ACCOUNT_MODERATION", { accountId: account.id }));
  };

  const onRemoveFromFollowers = () => {
    dispatch((_, getState) => {
      const unfollowModal = getSettings(getState()).get("unfollowModal");
      if (unfollowModal) {
        dispatch(
          openModal("CONFIRM", {
            message: (
              <FormattedMessage
                id="confirmations.remove_from_followers.message"
                defaultMessage="Are you sure you want to remove {name} from your followers?"
                values={{
                  name: (
                    <strong className="break-words">@{account.username}</strong>
                  ),
                }}
              />
            ), // eslint-disable-line formatjs/no-literal-string-in-jsx
            confirm: intl.formatMessage(messages.removeFromFollowersConfirm),
            onConfirm: () => dispatch(removeFromFollowers(account.id)),
          })
        );
      } else {
        dispatch(removeFromFollowers(account.id));
      }
    });
  };

  const onSearch = () => {
    dispatch(setSearchAccount(account.id));
    history.push("/search");
  };

  const onAvatarClick = () => {
    const avatar = normalizeAttachment({
      type: "image",
      url: account.avatar,
    });
    dispatch(
      openModal("MEDIA", { media: ImmutableList.of(avatar).toJS(), index: 0 })
    );
  };

  const handleAvatarClick: React.MouseEventHandler = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onAvatarClick();
    }
  };

  const onHeaderClick = () => {
    const header = normalizeAttachment({
      type: "image",
      url: account.header,
    });
    dispatch(
      openModal("MEDIA", { media: ImmutableList.of(header).toJS(), index: 0 })
    );
  };

  const handleHeaderClick: React.MouseEventHandler = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onHeaderClick();
    }
  };

  const handleShare = () => {
    navigator
      .share({
        text: `@${account.username}`,
        url: account.url,
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error(e);
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

    if ("share" in navigator) {
      menu.push({
        text: intl.formatMessage(messages.share, { name: account.username }),
        action: handleShare,
        icon: uploadIcon,
      });
    }

    menu.push({
      text: intl.formatMessage(messages.copy),
      action: handleCopy,
      icon: clipboardCopyIcon,
    });

    if (!ownAccount) return menu;

    menu.push({
      text: intl.formatMessage(
        account.id === ownAccount.id ? messages.searchSelf : messages.search,
        { name: account.username }
      ),
      action: onSearch,
      icon: searchIcon,
    });

    if (menu.length) {
      menu.push(null);
    }

    if (account.id === ownAccount.id) {
      menu.push({
        text: intl.formatMessage(messages.edit_profile),
        to: "/settings/profile",
        icon: userIcon,
      });
      menu.push({
        text: intl.formatMessage(messages.preferences),
        to: "/settings",
        icon: settingsIcon,
      });
      menu.push(null);
      menu.push({
        text: intl.formatMessage(messages.mutes),
        to: "/mutes",
        icon: circleXIcon,
      });
      menu.push({
        text: intl.formatMessage(messages.blocks),
        to: "/blocks",
        icon: banIcon,
      });
    } else {
      menu.push({
        text: intl.formatMessage(messages.mention, { name: account.username }),
        action: onMention,
        icon: atIcon,
      });
      menu.push({
        text: intl.formatMessage(messages.direct, { name: account.username }),
        action: onDirect,
        icon: mailIcon,
      });

      if (account.relationship?.following) {
        if (account.relationship?.showing_reposts) {
          menu.push({
            text: intl.formatMessage(messages.hideReposts, {
              name: account.username,
            }),
            action: onRepostToggle,
            icon: repeatIcon,
          });
        } else {
          menu.push({
            text: intl.formatMessage(messages.showReposts, {
              name: account.username,
            }),
            action: onRepostToggle,
            icon: repeatIcon,
          });
        }
      }

      menu.push(null);

      menu.push({
        text: intl.formatMessage(messages.removeFromFollowers),
        action: onRemoveFromFollowers,
        icon: userXIcon,
      });

      if (account.relationship?.muting) {
        menu.push({
          text: intl.formatMessage(messages.unmute, { name: account.username }),
          action: onMute,
          icon: circleXIcon,
        });
      } else {
        menu.push({
          text: intl.formatMessage(messages.mute, { name: account.username }),
          action: onMute,
          icon: circleXIcon,
        });
      }

      if (account.relationship?.blocking) {
        menu.push({
          text: intl.formatMessage(messages.unblock, {
            name: account.username,
          }),
          action: onBlock,
          icon: banIcon,
        });
      }

      menu.push({
        text: intl.formatMessage(messages.report, { name: account.username }),
        action: onReport,
        icon: flagIcon,
      });
    }

    if (ownAccount.staff) {
      menu.push(null);

      menu.push({
        text: intl.formatMessage(messages.adminAccount, {
          name: account.username,
        }),
        action: onModerate,
        icon: gavelIcon,
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
          key="followed_by"
          slug="opaque"
          title={
            <FormattedMessage
              id="account.follows_you"
              defaultMessage="Follows you"
            />
          }
        />
      );
    } else if (ownAccount.id !== account.id && account.relationship?.blocking) {
      info.push(
        <Badge
          key="blocked"
          slug="opaque"
          title={
            <FormattedMessage id="account.blocked" defaultMessage="Blocked" />
          }
        />
      );
    }

    if (ownAccount.id !== account.id && account.relationship?.muting) {
      info.push(
        <Badge
          key="muted"
          slug="opaque"
          title={<FormattedMessage id="account.muted" defaultMessage="Muted" />}
        />
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
          <a href={account.header} onClick={handleHeaderClick} target="_blank">
            {header}
          </a>
        );
      }
    }

    return header;
  };

  /*
  const renderMessageButton = () => {
    if (!ownAccount || !account || account.id === ownAccount?.id) {
      return null;
    }

    if (account.accepts_chat_messages) {
      return (
        <IconButton
          src={messagesIcon}
          onClick={() => createAndNavigateToChat.mutate(account.id)}
          title={intl.formatMessage(messages.chat, { name: account.username })}
          theme="outlined"
          className="px-2"
          iconClassName="h-4 w-4"
        />
      );
    } else {
      return null;
    }
  };
  */

  const renderShareButton = () => {
    const canShare = "share" in navigator;

    if (
      !(account && ownAccount?.id && account.id === ownAccount?.id && canShare)
    ) {
      return null;
    }

    return (
      <IconButton
        src={uploadIcon}
        onClick={handleShare}
        title={intl.formatMessage(messages.share, { name: account.username })}
        theme="outlined"
        className="px-2"
        iconClassName="h-4 w-4"
      />
    );
  };

  const info = makeInfo();
  const menu = makeMenu();

  return (
    <div className="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
      {account.moved && typeof account.moved === "object" && (
        <MovedNote from={account} to={account.moved as Account} />
      )}

      <div>
        <div className="relative isolate flex h-32 w-full flex-col justify-center overflow-hidden bg-gray-200 black:rounded-t-none dark:bg-gray-900/50 md:rounded-t-xl lg:h-48">
          {renderHeader()}

          <div className="absolute left-2 top-2">
            <HStack alignItems="center" space={1}>
              {info}
            </HStack>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <HStack className="-mt-12" alignItems="bottom" space={5}>
          <div className="relative flex">
            <a
              href={account.avatar}
              onClick={handleAvatarClick}
              target="_blank"
            >
              <Avatar
                src={account.avatar}
                size={96}
                className="relative size-24 rounded-5px bg-white ring-4 ring-primary-200 dark:bg-primary-900 dark:ring-secondary-800"
              />
            </a>
            {account.verified && (
              <div className="absolute bottom-0 right-0">
                <VerificationBadge className="size-6 rounded-5px bg-primary-200 ring-3 ring-primary-200 dark:bg-secondary-800 dark:ring-secondary-800" />
              </div>
            )}
          </div>

          <div className="mt-6 flex w-full justify-end sm:pb-1">
            <HStack space={2} className="mt-10">
              {/* renderMessageButton() */}
              {renderShareButton()}

              {menu.length > 0 && (
                <DropdownMenu items={menu} placement="bottom-end">
                  <IconButton
                    src={dotsIcon}
                    theme="outlined"
                    className="px-2"
                    iconClassName="h-4 w-4"
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

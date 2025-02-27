import arrowLeftIcon from "@tabler/icons/outline/arrow-left.svg";
import banIcon from "@tabler/icons/outline/ban.svg";
import infoCircleIcon from "@tabler/icons/outline/info-circle.svg";
import logoutIcon from "@tabler/icons/outline/logout.svg";
import { useRef } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link, useHistory, useParams } from "react-router-dom";

import { blockAccount, unblockAccount } from "src/actions/accounts";
import { openModal } from "src/actions/modals";
import List, { ListItem } from "src/components/List";
import Avatar from "src/components/Avatar";
import HStack from "src/components/HStack";
import IconButton from "src/components/IconButton";
import Icon from "src/components/Icon";
import { Menu, MenuButton, MenuItem, MenuList } from "src/components/Menu";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import Tooltip from "src/components/Tooltip";
import VerificationBadge from "src/components/VerificationBadge";
import { useChatContext } from "src/contexts/chat-context";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import {
  MessageExpirationValues,
  useChat,
  useChatActions,
  useChats,
} from "src/queries/chats";
import { secondsToDays } from "src/utils/numbers";

import Chat from "./Chat";

import BlankslateEmpty from "./ChatPageBlankslateEmpty";
import BlankslateWithChats from "./ChatPageBlankslateWithChats";

const messages = defineMessages({
  blockMessage: {
    id: "chat_settings.block.message",
    defaultMessage:
      "Blocking will prevent this profile from direct messaging you and viewing your content. You can unblock later.",
  },
  blockHeading: {
    id: "chat_settings.block.heading",
    defaultMessage: "Block @{username}",
  },
  blockConfirm: { id: "chat_settings.block.confirm", defaultMessage: "Block" },
  unblockMessage: {
    id: "chat_settings.unblock.message",
    defaultMessage:
      "Unblocking will allow this profile to direct message you and view your content.",
  },
  unblockHeading: {
    id: "chat_settings.unblock.heading",
    defaultMessage: "Unblock @{username}",
  },
  unblockConfirm: {
    id: "chat_settings.unblock.confirm",
    defaultMessage: "Unblock",
  },
  leaveMessage: {
    id: "chat_settings.leave.message",
    defaultMessage:
      "Are you sure you want to leave this chat? Messages will be deleted for you and this chat will be removed from your inbox.",
  },
  leaveHeading: {
    id: "chat_settings.leave.heading",
    defaultMessage: "Leave Chat",
  },
  leaveConfirm: {
    id: "chat_settings.leave.confirm",
    defaultMessage: "Leave Chat",
  },
  blockUser: {
    id: "chat_settings.options.block_user",
    defaultMessage: "Block @{username}",
  },
  unblockUser: {
    id: "chat_settings.options.unblock_user",
    defaultMessage: "Unblock @{username}",
  },
  reportUser: {
    id: "chat_settings.options.report_user",
    defaultMessage: "Report @{username}",
  },
  leaveChat: {
    id: "chat_settings.options.leave_chat",
    defaultMessage: "Leave Chat",
  },
  autoDeleteLabel: {
    id: "chat_settings.auto_delete.label",
    defaultMessage: "Auto-delete messages",
  },
  autoDeleteHint: {
    id: "chat_settings.auto_delete.hint",
    defaultMessage:
      "Sent messages will auto-delete after the time period selected",
  },
  autoDelete2Minutes: {
    id: "chat_settings.auto_delete.2minutes",
    defaultMessage: "2 minutes",
  },
  autoDelete7Days: {
    id: "chat_settings.auto_delete.7days",
    defaultMessage: "7 days",
  },
  autoDelete14Days: {
    id: "chat_settings.auto_delete.14days",
    defaultMessage: "14 days",
  },
  autoDelete30Days: {
    id: "chat_settings.auto_delete.30days",
    defaultMessage: "30 days",
  },
  autoDelete90Days: {
    id: "chat_settings.auto_delete.90days",
    defaultMessage: "90 days",
  },
  autoDeleteMessage: {
    id: "chat_window.auto_delete_label",
    defaultMessage:
      "Auto-delete after {day, plural, one {# day} other {# days}}",
  },
  autoDeleteMessageTooltip: {
    id: "chat_window.auto_delete_tooltip",
    defaultMessage:
      "Chat messages are set to auto-delete after {day, plural, one {# day} other {# days}} upon sending.",
  },
});

const ChatPageMain = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const history = useHistory();

  const { chatId } = useParams<{ chatId: string }>();

  const { data: chat } = useChat(chatId);
  const { currentChatId } = useChatContext();
  const {
    chatsQuery: { data: chats, isLoading },
  } = useChats();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { deleteChat, updateChat } = useChatActions(chat?.id as string);

  const handleUpdateChat = (value: MessageExpirationValues) =>
    updateChat.mutate({ message_expiration: value });

  const isBlocking = useAppSelector((state) =>
    state.relationships.getIn([chat?.account?.id, "blocking"])
  );

  const handleBlockUser = () => {
    dispatch(
      openModal("CONFIRM", {
        heading: intl.formatMessage(messages.blockHeading, {
          username: chat?.account.username,
        }),
        message: intl.formatMessage(messages.blockMessage),
        confirm: intl.formatMessage(messages.blockConfirm),
        confirmationTheme: "primary",
        onConfirm: () => dispatch(blockAccount(chat?.account.id as string)),
      })
    );
  };

  const handleUnblockUser = () => {
    dispatch(
      openModal("CONFIRM", {
        heading: intl.formatMessage(messages.unblockHeading, {
          username: chat?.account.username,
        }),
        message: intl.formatMessage(messages.unblockMessage),
        confirm: intl.formatMessage(messages.unblockConfirm),
        confirmationTheme: "primary",
        onConfirm: () => dispatch(unblockAccount(chat?.account.id as string)),
      })
    );
  };

  const handleLeaveChat = () => {
    dispatch(
      openModal("CONFIRM", {
        heading: intl.formatMessage(messages.leaveHeading),
        message: intl.formatMessage(messages.leaveMessage),
        confirm: intl.formatMessage(messages.leaveConfirm),
        confirmationTheme: "primary",
        onConfirm: () => {
          deleteChat.mutate(undefined, {
            onSuccess() {
              history.push("/chats");
            },
          });
        },
      })
    );
  };

  if (isLoading) {
    return null;
  }

  if (!currentChatId && chats && chats.length > 0) {
    return <BlankslateWithChats />;
  }

  if (!currentChatId) {
    return <BlankslateEmpty />;
  }

  if (!chat) {
    return null;
  }

  return (
    <Stack className="h-full overflow-hidden">
      <HStack
        alignItems="center"
        justifyContent="between"
        space={2}
        className="w-full p-4"
      >
        <HStack alignItems="center" space={2} className="overflow-hidden">
          <HStack alignItems="center">
            <IconButton
              src={arrowLeftIcon}
              className="mr-2 size-7 sm:mr-0 sm:hidden rtl:rotate-180"
              onClick={() => history.push("/chats")}
            />

            <Link to={`/@${chat.account.username}`}>
              <Avatar
                src={chat.account.avatar}
                size={40}
                className="flex-none"
              />
            </Link>
          </HStack>

          <Stack alignItems="start" className="h-11 overflow-hidden">
            <div className="flex w-full grow items-center space-x-1">
              <Link to={`/@${chat.account.username}`}>
                <Text weight="bold" size="sm" align="left" truncate>
                  {chat.account.display_name || `@${chat.account.username}`}{" "}
                  {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                </Text>
              </Link>
              {chat.account.verified && <VerificationBadge />}
            </div>

            {chat.message_expiration && (
              <Tooltip
                text={intl.formatMessage(messages.autoDeleteMessageTooltip, {
                  day: secondsToDays(chat.message_expiration),
                })}
              >
                <Text
                  align="left"
                  size="sm"
                  weight="medium"
                  theme="primary"
                  truncate
                  className="w-full cursor-help"
                >
                  {intl.formatMessage(messages.autoDeleteMessage, {
                    day: secondsToDays(chat.message_expiration),
                  })}
                </Text>
              </Tooltip>
            )}
          </Stack>
        </HStack>

        <Menu>
          <MenuButton
            as={IconButton}
            src={infoCircleIcon}
            iconClassName="h-5 w-5 text-gray-600"
            children={null}
          />

          <MenuList className="w-80">
            <Stack space={4} className="px-6 py-5">
              <HStack alignItems="center" space={3}>
                <Avatar src={chat.account.avatar_static} size={50} />
                <Stack>
                  <Text weight="semibold">{chat.account.display_name}</Text>
                  <Text size="sm" theme="primary">
                    @{chat.account.username}
                  </Text>{" "}
                  {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                </Stack>
              </HStack>

              <Stack space={2}>
                <MenuItem
                  as="button"
                  onSelect={isBlocking ? handleUnblockUser : handleBlockUser}
                  className="!px-0 hover:!bg-transparent"
                >
                  <div className="flex w-full items-center space-x-2 text-sm font-bold text-primary-500 dark:text-accent-blue">
                    <Icon src={banIcon} className="size-5" />
                    <span>
                      {intl.formatMessage(
                        isBlocking ? messages.unblockUser : messages.blockUser,
                        { username: chat.account.username }
                      )}
                    </span>
                  </div>
                </MenuItem>

                <MenuItem
                  as="button"
                  onSelect={handleLeaveChat}
                  className="!px-0 hover:!bg-transparent"
                >
                  <div className="flex w-full items-center space-x-2 text-sm font-bold text-danger-600 dark:text-danger-500">
                    <Icon src={logoutIcon} className="size-5" />
                    <span>{intl.formatMessage(messages.leaveChat)}</span>
                  </div>
                </MenuItem>
              </Stack>
            </Stack>
          </MenuList>
        </Menu>
      </HStack>

      <div className="h-full overflow-hidden">
        <Chat className="h-full" chat={chat} inputRef={inputRef} />
      </div>
    </Stack>
  );
};

export default ChatPageMain;

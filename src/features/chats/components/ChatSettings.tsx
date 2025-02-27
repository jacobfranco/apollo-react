import arrowLeftIcon from "@tabler/icons/outline/arrow-left.svg";
import banIcon from "@tabler/icons/outline/ban.svg";
import logoutIcon from "@tabler/icons/outline/logout.svg";
import { defineMessages, useIntl } from "react-intl";

import { blockAccount, unblockAccount } from "src/actions/accounts";
import { openModal } from "src/actions/modals";
import List, { ListItem } from "src/components/List";
import Avatar from "src/components/Avatar";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Select from "src/components/Select";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { ChatWidgetScreens, useChatContext } from "src/contexts/chat-context";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import {
  messageExpirationOptions,
  MessageExpirationValues,
  useChatActions,
} from "src/queries/chats";
import { secondsToDays } from "src/utils/numbers";

import ChatPaneHeader from "./ChatPaneHeader";

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
  title: { id: "chat_settings.title", defaultMessage: "Chat Details" },
  blockUser: {
    id: "chat_settings.options.block_user",
    defaultMessage: "Block @{username}",
  },
  unblockUser: {
    id: "chat_settings.options.unblock_user",
    defaultMessage: "Unblock @{username}",
  },
  leaveChat: {
    id: "chat_settings.options.leave_chat",
    defaultMessage: "Leave Chat",
  },
  autoDeleteLabel: {
    id: "chat_settings.auto_delete.label",
    defaultMessage: "Auto-delete messages",
  },
  autoDeleteDays: {
    id: "chat_settings.auto_delete.days",
    defaultMessage: "{day, plural, one {# day} other {# days}}",
  },
});

const ChatSettings = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const { chat, changeScreen, toggleChatPane } = useChatContext();
  const { deleteChat, updateChat } = useChatActions(chat?.id as string);

  const handleUpdateChat = (value: MessageExpirationValues) =>
    updateChat.mutate({ message_expiration: value });

  const isBlocking = useAppSelector((state) =>
    state.relationships.getIn([chat?.account?.id, "blocking"])
  );

  const closeSettings = () => {
    changeScreen(ChatWidgetScreens.CHAT, chat?.id);
  };

  const minimizeChatPane = () => {
    closeSettings();
    toggleChatPane();
  };

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
        onConfirm: () => deleteChat.mutate(),
      })
    );
  };

  if (!chat) {
    return null;
  }

  return (
    <>
      <ChatPaneHeader
        isOpen
        isToggleable={false}
        onToggle={minimizeChatPane}
        title={
          <HStack alignItems="center" space={2}>
            <button onClick={closeSettings}>
              <Icon
                src={arrowLeftIcon}
                className="size-6 text-gray-600 dark:text-gray-400 rtl:rotate-180"
              />
            </button>

            <Text weight="semibold">{intl.formatMessage(messages.title)}</Text>
          </HStack>
        }
      />

      <Stack space={4} className="mx-auto w-5/6">
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

        <Stack space={5}>
          <button
            onClick={isBlocking ? handleUnblockUser : handleBlockUser}
            className="flex w-full items-center space-x-2 text-sm font-bold text-primary-600 dark:text-accent-blue"
          >
            <Icon src={banIcon} className="size-5" />
            <span>
              {intl.formatMessage(
                isBlocking ? messages.unblockUser : messages.blockUser,
                { username: chat.account.username }
              )}
            </span>
          </button>

          <button
            onClick={handleLeaveChat}
            className="flex w-full items-center space-x-2 text-sm font-bold text-danger-600"
          >
            <Icon src={logoutIcon} className="size-5" />
            <span>{intl.formatMessage(messages.leaveChat)}</span>
          </button>
        </Stack>
      </Stack>
    </>
  );
};

export default ChatSettings;

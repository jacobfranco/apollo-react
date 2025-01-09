import clockIcon from "@tabler/icons/outline/clock.svg";
import clsx from "clsx";
import { defineMessages, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import { openModal } from "src/actions/modals";
import Link from "src/components/Link";
import Avatar from "src/components/Avatar";
import Button from "src/components/Button";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useChatContext } from "src/contexts/chat-context";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useChatActions } from "src/queries/chats";
import { secondsToDays } from "src/utils/numbers";

const messages = defineMessages({
  leaveChatHeading: {
    id: "chat_message_list_intro.leave_chat.heading",
    defaultMessage: "Leave Chat",
  },
  leaveChatMessage: {
    id: "chat_message_list_intro.leave_chat.message",
    defaultMessage:
      "Are you sure you want to leave this chat? Messages will be deleted for you and this chat will be removed from your inbox.",
  },
  leaveChatConfirm: {
    id: "chat_message_list_intro.leave_chat.confirm",
    defaultMessage: "Leave Chat",
  },
  intro: {
    id: "chat_message_list_intro.intro",
    defaultMessage: "wants to start a chat with you",
  },
  accept: {
    id: "chat_message_list_intro.actions.accept",
    defaultMessage: "Accept",
  },
  leaveChat: {
    id: "chat_message_list_intro.actions.leave_chat",
    defaultMessage: "Leave chat",
  },
  report: {
    id: "chat_message_list_intro.actions.report",
    defaultMessage: "Report",
  },
  messageLifespan: {
    id: "chat_message_list_intro.actions.message_lifespan",
    defaultMessage:
      "Messages older than {day, plural, one {# day} other {# days}} are deleted.",
  },
});

const ChatMessageListIntro = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const history = useHistory();

  const { chat, isUsingMainChatPage, needsAcceptance } = useChatContext();
  const { acceptChat, deleteChat } = useChatActions(chat?.id as string);

  const handleLeaveChat = () => {
    dispatch(
      openModal("CONFIRM", {
        heading: intl.formatMessage(messages.leaveChatHeading),
        message: intl.formatMessage(messages.leaveChatMessage),
        confirm: intl.formatMessage(messages.leaveChatConfirm),
        confirmationTheme: "primary",
        onConfirm: () => {
          deleteChat.mutate(undefined, {
            onSuccess() {
              if (isUsingMainChatPage) {
                history.push("/chats");
              }
            },
          });
        },
      })
    );
  };

  if (!chat) {
    return null;
  }

  return (
    <Stack
      data-testid="chat-message-list-intro"
      justifyContent="center"
      alignItems="center"
      space={4}
      className={clsx({
        "w-3/4 mx-auto": needsAcceptance,
        "py-6": true, // needs to be padding to prevent Virtuoso bugs
      })}
    >
      <Stack alignItems="center" space={2}>
        <Link to={`/@${chat.account.username}`}>
          <Avatar src={chat.account.avatar_static} size={75} />
        </Link>

        <Text size="lg" align="center">
          {needsAcceptance ? (
            <>
              <Text tag="span" weight="semibold">
                @{chat.account.username}
              </Text>{" "}
              {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}{" "}
              <Text tag="span">{intl.formatMessage(messages.intro)}</Text>
            </>
          ) : (
            <Link to={`/@${chat.account.username}`}>
              <Text tag="span" theme="inherit" weight="semibold">
                @{chat.account.username}
              </Text>{" "}
              {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
            </Link>
          )}
        </Text>
      </Stack>

      {needsAcceptance ? (
        <HStack alignItems="center" space={2} className="w-full">
          <Button
            theme="primary"
            block
            onClick={() => acceptChat.mutate()}
            disabled={acceptChat.isPending}
          >
            {intl.formatMessage(messages.accept)}
          </Button>

          <Button theme="danger" block onClick={handleLeaveChat}>
            {intl.formatMessage(messages.leaveChat)}
          </Button>
        </HStack>
      ) : (
        <HStack
          justifyContent="center"
          alignItems="center"
          space={1}
          className="shrink-0"
        >
          <Icon src={clockIcon} className="size-4 text-gray-600" />
          {chat.message_expiration && (
            <Text size="sm" theme="muted">
              {intl.formatMessage(messages.messageLifespan, {
                day: secondsToDays(chat.message_expiration),
              })}
            </Text>
          )}
        </HStack>
      )}
    </Stack>
  );
};

export default ChatMessageListIntro;

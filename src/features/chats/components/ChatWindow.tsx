import React, { useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { HStack, Stack, Text, Tooltip, VerificationBadge } from 'src/components';
import { ChatWidgetScreens, useChatContext } from 'src/contexts/chat-context';
import { secondsToDays } from 'src/utils/numbers';

import Chat from './Chat';

import ChatPaneHeader from './ChatPaneHeader';
import ChatSettings from './ChatSettings';
import Icon from 'src/components/Icon';
import Avatar from 'src/components/Avatar';

const messages = defineMessages({
  autoDeleteMessage: { id: 'chat_window.auto_delete_label', defaultMessage: 'Auto-delete after {day, plural, one {# day} other {# days}}' },
  autoDeleteMessageTooltip: { id: 'chat_window.auto_delete_tooltip', defaultMessage: 'Chat messages are set to auto-delete after {day, plural, one {# day} other {# days}} upon sending.' },
});

const LinkWrapper = ({ enabled, to, children }: { enabled: boolean; to: string; children: React.ReactNode }): JSX.Element => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Link to={to}>
      {children}
    </Link>
  );
};

/** Floating desktop chat window. */
const ChatWindow = () => {
  const intl = useIntl();

  const { chat, currentChatId, screen, changeScreen, isOpen, needsAcceptance, toggleChatPane } = useChatContext();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const closeChat = () => {
    changeScreen(ChatWidgetScreens.INBOX);
  };

  const openSearch = () => {
    toggleChatPane();
    changeScreen(ChatWidgetScreens.SEARCH);
  };

  const openChatSettings = () => {
    changeScreen(ChatWidgetScreens.CHAT_SETTINGS, currentChatId);
  };

  const secondaryAction = () => {
    if (needsAcceptance) {
      return undefined;
    }

    return isOpen ? openChatSettings : openSearch;
  };

  if (!chat) return null;

  if (screen === ChatWidgetScreens.CHAT_SETTINGS) {
    return <ChatSettings />;
  }

  return (
    <>
      <ChatPaneHeader
        title={
          <HStack alignItems='center' space={2}>
            {isOpen && (
              <button onClick={closeChat}>
                <Icon
                  src={require('@tabler/icons/outline/arrow-left.svg')}
                  className='h-6 w-6 text-gray-600 rtl:rotate-180 dark:text-gray-400'
                />
              </button>
            )}

            <HStack alignItems='center' space={3}>
              {isOpen && (
                <Link to={`/@${chat.account.username}`}>
                  <Avatar src={chat.account.avatar} size={40} />
                </Link>
              )}

              <Stack alignItems='start'>
                <LinkWrapper enabled={isOpen} to={`/@${chat.account.username}`}>
                  <div className='flex grow items-center space-x-1'>
                    <Text size='sm' weight='bold' truncate>{chat.account.display_name || `@${chat.account.username}`}</Text>
                    {chat.account.verified && <VerificationBadge />}
                  </div>
                </LinkWrapper>

                {chat.message_expiration && (
                  <Tooltip
                    text={intl.formatMessage(messages.autoDeleteMessageTooltip, { day: secondsToDays(chat.message_expiration) })}
                  >
                    <Text size='sm' weight='medium' theme='primary' truncate className='cursor-help'>
                      {intl.formatMessage(messages.autoDeleteMessage, { day: secondsToDays(chat.message_expiration) })}
                    </Text>
                  </Tooltip>
                )}
              </Stack>
            </HStack>
          </HStack>
        }
        secondaryAction={secondaryAction()}
        secondaryActionIcon={isOpen ? require('@tabler/icons/outline/info-circle.svg') : require('@tabler/icons/outline/edit.svg')}
        isToggleable={!isOpen}
        isOpen={isOpen}
        onToggle={toggleChatPane}
      />

      <Stack className='h-full grow overflow-hidden' space={2}>
        <Chat chat={chat} inputRef={inputRef} />
      </Stack>
    </>
  );
};

export default ChatWindow;
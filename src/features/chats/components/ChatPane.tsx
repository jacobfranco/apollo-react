import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Pane, Stack } from 'src/components';
import { ChatWidgetScreens, useChatContext } from 'src/contexts/chat-context';
import { useStatContext } from 'src/contexts/stat-context';
import { useDebounce } from 'src/hooks';
import { IChat, useChats } from 'src/queries/chats';

import ChatList from './ChatList';
import ChatSearch from './ChatSearch';
import ChatSearchEmptyResultsBlankslate from './ChatSearchEmptyResultsBlankslate';
import ChatSearchInput from './ChatSearchInput';
import ChatPaneHeader from './ChatPaneHeader';
import ChatWindow from './ChatWindow';
import ChatSearchHeader from './ChatSearchHeader';
import ChatPaneBlankslate from './ChatPaneBlankslate';

const ChatPane = () => {
  const debounce = useDebounce;
  const { unreadChatsCount } = useStatContext();

  const [value, setValue] = useState<string>();
  const debouncedValue = debounce(value as string, 300);

  const { screen, changeScreen, isOpen, toggleChatPane } = useChatContext();
  const { chatsQuery: { data: chats, isLoading } } = useChats(debouncedValue);

  const hasSearchValue = Number(debouncedValue?.length) > 0;

  const handleClickChat = (nextChat: IChat) => {
    changeScreen(ChatWidgetScreens.CHAT, nextChat.id);
    setValue(undefined);
  };

  const clearValue = () => {
    if (hasSearchValue) {
      setValue('');
    }
  };

  const renderBody = () => {
    if (hasSearchValue || Number(chats?.length) > 0 || isLoading) {
      return (
        <Stack space={4} className='h-full grow'>
            <div className='px-4'>
              <ChatSearchInput
                value={value || ''}
                onChange={(event) => setValue(event.target.value)}
                onClear={clearValue}
              />
            </div>

          {(Number(chats?.length) > 0 || isLoading) ? (
            <ChatList
              searchValue={debouncedValue}
              onClickChat={handleClickChat}
            />
          ) : (
            <ChatSearchEmptyResultsBlankslate />
          )}
        </Stack>
      );
    } else if (chats?.length === 0) {
      return (
        <ChatPaneBlankslate
          onSearch={() => {
            changeScreen(ChatWidgetScreens.SEARCH);
          }}
        />
      );
    }
  };

  // Active chat
  if (screen === ChatWidgetScreens.CHAT || screen === ChatWidgetScreens.CHAT_SETTINGS) {
    return (
      <Pane isOpen={isOpen}>
        <ChatWindow />
      </Pane>
    );
  }

  if (screen === ChatWidgetScreens.SEARCH) {
    return (
      <Pane isOpen={isOpen}>
        <ChatSearchHeader />

        {isOpen ? <ChatSearch /> : null}
      </Pane>
    );
  }

  return (
    <Pane isOpen={isOpen}>
      <ChatPaneHeader
        title={<FormattedMessage id='column.chats' defaultMessage='Chats' />}
        unreadCount={unreadChatsCount}
        isOpen={isOpen}
        onToggle={toggleChatPane}
        secondaryAction={() => {
          changeScreen(ChatWidgetScreens.SEARCH);
          setValue(undefined);

          if (!isOpen) {
            toggleChatPane();
          }
        }}
        secondaryActionIcon={require('@tabler/icons/outline/edit.svg')}
      />

      {isOpen ? renderBody() : null}
    </Pane>
  );
};

export default ChatPane;
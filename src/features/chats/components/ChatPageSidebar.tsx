import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { CardTitle, HStack, IconButton, Stack } from 'src/components';
import { useDebounce } from 'src/hooks';
import { IChat } from 'src/queries/chats';

import ChatList from './ChatList';
import ChatSearchInput from './ChatSearchInput';

const messages = defineMessages({
  title: { id: 'column.chats', defaultMessage: 'Messages' },
});

const ChatPageSidebar = () => {
  const intl = useIntl();
  const history = useHistory();

  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const handleClickChat = (chat: IChat) => {
    history.push(`/chats/${chat.id}`);
  };

  const handleChatCreate = () => {
    history.push('/chats/new');
  };

  const handleSettingsClick = () => {
    history.push('/chats/settings');
  };

  return (
    <Stack space={4} className='h-full'>
      <Stack space={4} className='px-4 pt-6'>
        <HStack alignItems='center' justifyContent='between'>
          <CardTitle title={intl.formatMessage(messages.title)} />

          <HStack space={1}>
            <IconButton
              src={require('@tabler/icons/settings.svg')}
              iconClassName='h-5 w-5 text-gray-600'
              onClick={handleSettingsClick}
            />

            <IconButton
              src={require('@tabler/icons/edit.svg')}
              iconClassName='h-5 w-5 text-gray-600'
              onClick={handleChatCreate}
            />
          </HStack>
        </HStack>

          <ChatSearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
      </Stack>

      <Stack className='h-full grow'>
        <ChatList
          onClickChat={handleClickChat}
          searchValue={debouncedSearch}
        />
      </Stack>
    </Stack>
  );
};

export default ChatPageSidebar;
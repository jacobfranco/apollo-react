import React from 'react';
import { useHistory } from 'react-router-dom';

import { ChatProvider } from 'src/contexts/chat-context';
import { useOwnAccount } from 'src/hooks';

import ChatPane from './ChatPane';

const ChatWidget = () => {
  const { account } = useOwnAccount();
  const history = useHistory();

  const path = history.location.pathname;
  const isChatsPath = Boolean(path.match(/^\/chats/));
  const isOnboarded = account?.chats_onboarded ?? true;

  if (!isOnboarded || isChatsPath) {
    return null;
  }

  return (
    <ChatProvider>
      <ChatPane />
    </ChatProvider>
  );
};

export default ChatWidget;
import React from 'react';

import { ChatProvider } from 'src/contexts/chat-context';

import ChatPage from './components/ChatPage';

interface IChatIndex {
  params?: {
    chatId?: string
  }
}

const ChatIndex: React.FC<IChatIndex> = ({ params }) => (
  <ChatProvider>
    <ChatPage chatId={params?.chatId} />
  </ChatProvider>
);

export default ChatIndex;
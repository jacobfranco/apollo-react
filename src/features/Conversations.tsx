import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { directComposeById } from 'src/actions/compose';
import { mountConversations, unmountConversations, expandConversations } from 'src/actions/conversations';
import { useDirectStream } from 'src/api/hooks';
import { AccountSearch, Column, ConversationsList } from 'src/components';
import { useAppDispatch } from 'src/hooks';

const messages = defineMessages({
  title: { id: 'column.direct', defaultMessage: 'Direct messages' },
  searchPlaceholder: { id: 'direct.search_placeholder', defaultMessage: 'Send a message to…' },
});

const ConversationsTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  useDirectStream();

  useEffect(() => {
    dispatch(mountConversations());
    dispatch(expandConversations());

    return () => {
      dispatch(unmountConversations());
    };
  }, []);

  const handleSuggestion = (accountId: string) => {
    dispatch(directComposeById(accountId));
  };

  return (
    <Column label={intl.formatMessage(messages.title)}>
      <AccountSearch
        placeholder={intl.formatMessage(messages.searchPlaceholder)}
        onSelected={handleSuggestion}
      />

      <ConversationsList />
    </Column>
  );
};

export default ConversationsTimeline;
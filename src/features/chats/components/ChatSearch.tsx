import searchIcon from "@tabler/icons/outline/search.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import { HTTPError } from "src/api/HTTPError";
import Icon from "src/components/Icon";
import Input from "src/components/Input";
import Stack from "src/components/Stack";
import { ChatWidgetScreens, useChatContext } from "src/contexts/chat-context";
import { useDebounce } from "src/hooks/useDebounce";
import { useChats, ChatKeys } from "src/queries/chats";
import { queryClient } from "src/queries/client";
import useAccountSearch from "src/queries/search";
import toast from "src/toast";

import Blankslate from "./ChatSearchBlankslate";
import EmptyResultsBlankslate from "./ChatSearchEmptyResultsBlankslate";
import Results from "./ChatSearchResults";

const messages = defineMessages({
  placeholder: { id: "chat_search.placeholder", defaultMessage: "Type a name" },
});

interface IChatSearch {
  isMainPage?: boolean;
}

const ChatSearch = (props: IChatSearch) => {
  const intl = useIntl();
  const { isMainPage = false } = props;

  const debounce = useDebounce;
  const history = useHistory();

  const { changeScreen } = useChatContext();
  const { getOrCreateChatByAccountId } = useChats();

  const [value, setValue] = useState<string>("");
  const debouncedValue = debounce(value as string, 300);

  const accountSearchResult = useAccountSearch(debouncedValue);
  const { data: accounts, isFetching } = accountSearchResult;

  const hasSearchValue = debouncedValue && debouncedValue.length > 0;
  const hasSearchResults = (accounts || []).length > 0;

  const handleClickOnSearchResult = useMutation({
    mutationFn: (accountId: string) => getOrCreateChatByAccountId(accountId),
    onError: (error) => {
      if (error instanceof HTTPError) {
        toast.showAlertForError(error);
      }
    },
    onSuccess: async (response) => {
      const data = await response.json();

      if (isMainPage) {
        history.push(`/chats/${data.id}`);
      } else {
        changeScreen(ChatWidgetScreens.CHAT, data.id);
      }

      queryClient.invalidateQueries({ queryKey: ChatKeys.chatSearch() });
    },
  });

  const renderBody = () => {
    if (hasSearchResults) {
      return (
        <Results
          accountSearchResult={accountSearchResult}
          onSelect={(id) => {
            handleClickOnSearchResult.mutate(id);
            clearValue();
          }}
        />
      );
    } else if (hasSearchValue && !hasSearchResults && !isFetching) {
      return <EmptyResultsBlankslate />;
    } else {
      return <Blankslate />;
    }
  };

  const clearValue = () => {
    if (hasSearchValue) {
      setValue("");
    }
  };

  return (
    <Stack space={4} className="h-full grow">
      <div className="px-4">
        <Input
          data-testid="search"
          type="text"
          autoFocus
          placeholder={intl.formatMessage(messages.placeholder)}
          value={value || ""}
          onChange={(event) => setValue(event.target.value)}
          outerClassName="mt-0"
          theme="search"
          append={
            <button onClick={clearValue}>
              <Icon
                src={hasSearchValue ? xIcon : searchIcon}
                className="size-4 text-gray-700 dark:text-gray-600"
                aria-hidden="true"
              />
            </button>
          }
        />
      </div>

      <Stack className="grow">{renderBody()}</Stack>
    </Stack>
  );
};

export default ChatSearch;

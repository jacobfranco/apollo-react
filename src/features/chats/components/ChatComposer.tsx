import sendIcon from "@tabler/icons/outline/send.svg";
import { forwardRef, useState } from "react";
import { defineMessages, IntlShape, useIntl } from "react-intl";

import { unblockAccount } from "src/actions/accounts";
import { openModal } from "src/actions/modals";
import Button from "src/components/Button";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "src/components/Combobox";
import HStack from "src/components/HStack";
import IconButton from "src/components/IconButton";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useChatContext } from "src/contexts/chat-context";
import UploadButton from "src/features/compose/components/UploadButton";
import emojiSearch from "src/features/emoji/search";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { Attachment } from "src/types/entities";
import { textAtCursorMatchesToken } from "src/utils/suggestions";

import ChatTextarea from "./ChatTextarea";

import type { Emoji, NativeEmoji } from "src/features/emoji/index";

const messages = defineMessages({
  placeholder: {
    id: "chat.input.placeholder",
    defaultMessage: "Type a message",
  },
  send: { id: "chat.actions.send", defaultMessage: "Send" },
  retry: { id: "chat.retry", defaultMessage: "Retry?" },
  blocked: {
    id: "chat_message_list.blocked",
    defaultMessage: "You blocked this user",
  },
  unblock: { id: "chat_composer.unblock", defaultMessage: "Unblock" },
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
});

const initialSuggestionState = {
  list: [],
  tokenStart: 0,
  token: "",
};

interface Suggestion {
  list: Emoji[];
  tokenStart: number;
  token: string;
}

interface IChatComposer
  extends Pick<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onKeyDown" | "onChange" | "onPaste" | "disabled"
  > {
  value: string;
  onSubmit: () => void;
  errorMessage: string | undefined;
  onSelectFile: (files: FileList, intl: IntlShape) => void;
  resetFileKey: number | null;
  resetContentKey: number | null;
  attachments?: Attachment[];
  onDeleteAttachment?: (i: number) => void;
  uploadCount?: number;
  uploadProgress?: number;
}

/** Textarea input for chats. */
const ChatComposer = forwardRef<HTMLTextAreaElement | null, IChatComposer>(
  (
    {
      onKeyDown,
      onChange,
      value,
      onSubmit,
      errorMessage = false,
      disabled = false,
      onSelectFile,
      resetFileKey,
      resetContentKey,
      onPaste,
      attachments = [],
      onDeleteAttachment,
      uploadCount = 0,
      uploadProgress,
    },
    ref
  ) => {
    const intl = useIntl();
    const dispatch = useAppDispatch();

    const { chat } = useChatContext();

    const isBlocked = useAppSelector((state) =>
      state.relationships.getIn([chat?.account?.id, "blocked_by"])
    );
    const isBlocking = useAppSelector((state) =>
      state.relationships.getIn([chat?.account?.id, "blocking"])
    );
    const maxCharacterCount = 10000;
    const attachmentLimit = 4;

    const [suggestions, setSuggestions] = useState<Suggestion>(
      initialSuggestionState
    );
    const isSuggestionsAvailable = suggestions.list.length > 0;

    const isUploading = uploadCount > 0;
    const hasAttachment = attachments.length > 0;
    const isOverCharacterLimit =
      maxCharacterCount && value?.length > maxCharacterCount;
    const isSubmitDisabled =
      disabled ||
      isUploading ||
      isOverCharacterLimit ||
      (value.length === 0 && !hasAttachment);

    const overLimitText = maxCharacterCount
      ? maxCharacterCount - value?.length
      : "";

    const renderSuggestionValue = (emoji: any) => {
      return `${value.slice(0, suggestions.tokenStart)}${emoji.native} ${(
        value as string
      ).slice(suggestions.tokenStart + suggestions.token.length)}`;
    };

    const onSelectComboboxOption = (selection: string) => {
      const event = {
        target: { value: selection },
      } as React.ChangeEvent<HTMLTextAreaElement>;

      if (onChange) {
        onChange(event);
        setSuggestions(initialSuggestionState);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const [tokenStart, token] = textAtCursorMatchesToken(
        event.target.value,
        event.target.selectionStart,
        [":"]
      );

      if (token && tokenStart) {
        const results = emojiSearch(token.replace(":", ""), { maxResults: 5 });
        setSuggestions({
          list: results,
          token,
          tokenStart: tokenStart - 1,
        });
      } else {
        setSuggestions(initialSuggestionState);
      }

      if (onChange) {
        onChange(event);
      }
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
      event
    ) => {
      if (event.key === "Enter" && !event.shiftKey && isSuggestionsAvailable) {
        return;
      }

      if (onKeyDown) {
        onKeyDown(event);
      }
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

    if (isBlocking) {
      return (
        <div className="mt-auto p-6 shadow-3xl dark:border-t-2 dark:border-solid dark:border-gray-800">
          <Stack space={3} alignItems="center">
            <Text align="center" theme="muted">
              {intl.formatMessage(messages.blocked)}
            </Text>

            <Button theme="secondary" onClick={handleUnblockUser}>
              {intl.formatMessage(messages.unblock)}
            </Button>
          </Stack>
        </div>
      );
    }

    if (isBlocked) {
      return null;
    }

    return (
      <div className="mt-auto px-4 shadow-3xl">
        {/* Spacer */}
        <div className="h-5" />

        <HStack alignItems="stretch" justifyContent="between" space={4}>
          <Stack
            justifyContent="end"
            alignItems="center"
            className="mb-1.5 w-10"
          >
            <UploadButton
              onSelectFile={onSelectFile}
              resetFileKey={resetFileKey}
              iconClassName="h-5 w-5"
              className="text-primary-500"
              disabled={isUploading || attachments.length >= attachmentLimit}
            />
          </Stack>

          <Stack grow>
            <Combobox onSelect={onSelectComboboxOption}>
              <ComboboxInput
                key={resetContentKey}
                as={ChatTextarea}
                autoFocus
                ref={ref}
                placeholder={intl.formatMessage(messages.placeholder)}
                onKeyDown={handleKeyDown}
                value={value}
                onChange={handleChange}
                onPaste={onPaste}
                isResizeable={false}
                autoGrow
                maxRows={5}
                disabled={disabled}
                attachments={attachments}
                onDeleteAttachment={onDeleteAttachment}
                uploadCount={uploadCount}
                uploadProgress={uploadProgress}
              />
              {isSuggestionsAvailable ? (
                <ComboboxPopover>
                  <ComboboxList>
                    {suggestions.list.map((emojiSuggestion) => (
                      <ComboboxOption
                        key={emojiSuggestion.colons}
                        value={renderSuggestionValue(emojiSuggestion)}
                      >
                        <span>{(emojiSuggestion as NativeEmoji).native}</span>
                        <span className="ml-1">{emojiSuggestion.colons}</span>
                      </ComboboxOption>
                    ))}
                  </ComboboxList>
                </ComboboxPopover>
              ) : null}
            </Combobox>
          </Stack>

          <Stack
            space={2}
            justifyContent="end"
            alignItems="center"
            className="mb-1.5 w-10"
          >
            {isOverCharacterLimit ? (
              <Text size="sm" theme="danger">
                {overLimitText}
              </Text>
            ) : null}

            <IconButton
              src={sendIcon}
              iconClassName="h-5 w-5"
              className="text-primary-500"
              disabled={isSubmitDisabled}
              onClick={onSubmit}
            />
          </Stack>
        </HStack>

        <HStack alignItems="center" className="h-5" space={1}>
          {errorMessage && (
            <>
              <Text theme="danger" size="xs">
                {errorMessage}
              </Text>

              <button onClick={onSubmit} className="flex hover:underline">
                <Text theme="primary" size="xs" tag="span">
                  {intl.formatMessage(messages.retry)}
                </Text>
              </button>
            </>
          )}
        </HStack>
      </div>
    );
  }
);

export default ChatComposer;

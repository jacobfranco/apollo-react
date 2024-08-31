import clsx from 'clsx';
import { CLEAR_EDITOR_COMMAND, TextNode, type LexicalEditor, $getRoot } from 'lexical';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { length } from 'stringz';

import {
  changeCompose,
  submitCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  uploadCompose,
} from 'src/actions/compose';
import AutosuggestInput, { AutoSuggestion } from 'src/components/AutosuggestInput';
import { HStack, Stack } from 'src/components';
import { default as Button } from 'src/components/Button'
import EmojiPickerDropdown from 'src/containers/EmojiPickerDropdownContainer';
import { ComposeEditor } from 'src/features/AsyncComponents';
import { useAppDispatch, useAppSelector, useCompose, useDraggedFiles, usePrevious } from 'src/hooks';

import QuotedStatusContainer from 'src/containers/ComposeQuotedStatusContainer';
import ReplyIndicatorContainer from 'src/containers/ReplyIndicatorContainer';
import UploadButtonContainer from 'src/containers/UploadButtonContainer';
import WarningContainer from 'src/containers/WarningContainer';
import { $createEmojiNode } from '../editor/nodes/EmojiNode';
import { countableText } from 'src/utils/counter';

import MarkdownButton from './MarkdownButton';
import PollButton from './PollButton';
import PollForm from './PollForm';
import PrivacyDropdown from './PrivacyDropdown';
import ReplyGroupIndicator from './ReplyGroupIndicator';
import ReplyMentions from './ReplyMentions';
import ScheduleButton from './ScheduleButton';
import ScheduleForm from './ScheduleForm';
import SpoilerButton from './SpoilerButton';
import SpoilerInput from './SpoilerInput';
import TextCharacterCounter from './TextCharacterCounter';
import UploadForm from './UploadForm';
import VisualCharacterCounter from './VisualCharacterCounter';
import Warning from './Warning';

import type { Emoji } from 'src/features/emoji';

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: 'What\'s on your mind?' },
  pollPlaceholder: { id: 'compose_form.poll_placeholder', defaultMessage: 'Add a poll topic…' },
  eventPlaceholder: { id: 'compose_form.event_placeholder', defaultMessage: 'Post to this event' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Post' },
  publishLoud: { id: 'compose_form.publish_loud', defaultMessage: '{publish}!' },
  message: { id: 'compose_form.message', defaultMessage: 'Message' },
  schedule: { id: 'compose_form.schedule', defaultMessage: 'Schedule' },
  saveChanges: { id: 'compose_form.save_changes', defaultMessage: 'Save changes' },
});

interface IComposeForm<ID extends string> {
  id: ID extends 'default' ? never : ID;
  shouldCondense?: boolean;
  autoFocus?: boolean;
  clickableAreaRef?: React.RefObject<HTMLDivElement>;
  event?: string;
  group?: string;
  extra?: React.ReactNode;
}

const ComposeForm = <ID extends string>({ id, shouldCondense, autoFocus, clickableAreaRef, event, group, extra }: IComposeForm<ID>) => {
  const history = useHistory();
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const compose = useCompose(id);
  const showSearch = useAppSelector((state) => state.search.submitted && !state.search.hidden);
  const maxTootChars = 360 // TODO: Change max characters when you figure it out
  const scheduledStatusCount = useAppSelector((state) => state.scheduled_statuses.size);

  const {
    spoiler,
    spoiler_text: spoilerText,
    privacy,
    is_submitting: isSubmitting,
    is_changing_upload:
    isChangingUpload,
    is_uploading: isUploading,
    schedule: scheduledAt,
    group_id: groupId,
  } = compose;

  const prevSpoiler = usePrevious(spoiler);

  const hasPoll = !!compose.poll;
  const isEditing = compose.id !== null;
  const anyMedia = compose.media_attachments.size > 0;

  const [composeFocused, setComposeFocused] = useState(false);

  const firstRender = useRef(true);
  const formRef = useRef<HTMLDivElement>(null);
  const spoilerTextRef = useRef<AutosuggestInput>(null);
  const editorRef = useRef<LexicalEditor>(null);
  const { isDraggedOver } = useDraggedFiles(formRef);

  const text = editorRef.current?.getEditorState().read(() => $getRoot().getTextContent()) ?? '';
  const fulltext = [spoilerText, countableText(text)].join('');

  const isEmpty = !(fulltext.trim() || anyMedia);
  const condensed = shouldCondense && !isDraggedOver && !composeFocused && isEmpty && !isUploading;
  const shouldAutoFocus = autoFocus && !showSearch;
  const canSubmit = !!editorRef.current && !isSubmitting && !isUploading && !isChangingUpload && !isEmpty && length(fulltext) <= maxTootChars;

  const getClickableArea = () => {
    return clickableAreaRef ? clickableAreaRef.current : formRef.current;
  };

  const isClickOutside = (e: MouseEvent | React.MouseEvent) => {
    return ![
      // List of elements that shouldn't collapse the composer when clicked
      // FIXME: Make this less brittle
      getClickableArea(),
      document.querySelector('.privacy-dropdown__dropdown'),
      document.querySelector('em-emoji-picker'),
      document.getElementById('modal-overlay'),
    ].some(element => element?.contains(e.target as any));
  };

  const handleClick = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isEmpty && isClickOutside(e)) {
      handleClickOutside();
    }
  }, [isEmpty]);

  const handleClickOutside = () => {
    setComposeFocused(false);
  };

  const handleComposeFocus = () => {
    setComposeFocused(true);
  };

  const handleSubmit = (e?: React.FormEvent<Element>) => {
    if (!canSubmit) return;
    e?.preventDefault();

    dispatch(changeCompose(id, text));
    dispatch(submitCompose(id, { history }));

    editorRef.current?.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  };

  const onSuggestionsClearRequested = () => {
    dispatch(clearComposeSuggestions(id));
  };

  const onSuggestionsFetchRequested = (token: string | number) => {
    dispatch(fetchComposeSuggestions(id, token as string));
  };

  const onSpoilerSuggestionSelected = (tokenStart: number, token: string | null, value: AutoSuggestion) => {
    dispatch(selectComposeSuggestion(id, tokenStart, token, value, ['spoiler_text']));
  };

  const handleEmojiPick = (data: Emoji) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.update(() => {
      editor.getEditorState()._selection?.insertNodes([$createEmojiNode(data), new TextNode(' ')]);
    });
  };

  const onPaste = (files: FileList) => {
    dispatch(uploadCompose(id, files, intl));
  };

  const focusSpoilerInput = () => {
    spoilerTextRef.current?.input?.focus();
  };

  useEffect(() => {
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  useEffect(() => {
    if (spoiler && firstRender.current) {
      firstRender.current = false;
    } else if (!spoiler && prevSpoiler) {
      //
    } else if (spoiler && !prevSpoiler) {
      focusSpoilerInput();
    }
  }, [spoiler]);

  const renderButtons = useCallback(() => (
    <HStack alignItems='center' space={2}>
      <UploadButtonContainer composeId={id} />
      {<EmojiPickerDropdown onPickEmoji={handleEmojiPick} condensed={shouldCondense} />}
      <PollButton composeId={id} />
      {!group && !groupId && <PrivacyDropdown composeId={id} />}
      <ScheduleButton composeId={id} />
      <SpoilerButton composeId={id} />
      <MarkdownButton composeId={id} />
    </HStack>
  ), [id]);

  const composeModifiers = !condensed && (
    <Stack space={4} className='compose-form__modifiers'>
      <UploadForm composeId={id} onSubmit={handleSubmit} />
      <PollForm composeId={id} />

      <SpoilerInput
        composeId={id}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSpoilerSuggestionSelected}
        ref={spoilerTextRef}
      />

      <ScheduleForm composeId={id} />
    </Stack>
  );

  let publishText: string | JSX.Element = '';
  let publishIcon: string | undefined = undefined;

  if (isEditing) {
    publishText = intl.formatMessage(messages.saveChanges);
  } else if (privacy === 'direct') {
    publishIcon = require('@tabler/icons/outline/mail.svg');
    publishText = intl.formatMessage(messages.message);
  } else if (privacy === 'private') {
    publishIcon = require('@tabler/icons/outline/lock.svg');
    publishText = intl.formatMessage(messages.publish);
  } else {
    publishText = privacy !== 'unlisted' ? intl.formatMessage(messages.publishLoud, { publish: intl.formatMessage(messages.publish) }) : intl.formatMessage(messages.publish);
  }

  if (scheduledAt) {
    publishText = intl.formatMessage(messages.schedule);
  }

  return (
    <Stack className='w-full' space={4} ref={formRef} onClick={handleClick} element='form' onSubmit={handleSubmit}>
      {scheduledStatusCount > 0 && !event && !group && (
        <Warning
          message={(
            <FormattedMessage
              id='compose_form.scheduled_statuses.message'
              defaultMessage='You have scheduled posts. {click_here} to see them.'
              values={{
                click_here: (
                  <Link to='/scheduled_statuses'>
                    <FormattedMessage
                      id='compose_form.scheduled_statuses.click_here'
                      defaultMessage='Click here'
                    />
                  </Link>
                )
              }}
            />)
          }
        />
      )}

      <WarningContainer composeId={id} />

      {!shouldCondense && !event && !group && groupId && <ReplyGroupIndicator composeId={id} />}

      {!shouldCondense && !event && !group && <ReplyIndicatorContainer composeId={id} />}

      {!shouldCondense && !event && !group && <ReplyMentions composeId={id} />}

      <div>
        <Suspense>
          <ComposeEditor
            ref={editorRef}
            className='mt-2'
            composeId={id}
            condensed={condensed}
            eventDiscussion={!!event}
            autoFocus={shouldAutoFocus}
            hasPoll={hasPoll}
            handleSubmit={handleSubmit}
            onFocus={handleComposeFocus}
            onPaste={onPaste}
          />
        </Suspense>
        {composeModifiers}
      </div>

      <QuotedStatusContainer composeId={id} />

      {extra && <div className={clsx({ 'hidden': condensed })}>{extra}</div>}

      <div
        className={clsx('flex flex-wrap items-center justify-between', {
          'hidden': condensed,
        })}
      >
        {renderButtons()}

        <HStack space={4} alignItems='center' className='ml-auto rtl:ml-0 rtl:mr-auto'>
          {maxTootChars && (
            <HStack space={1} alignItems='center'>
              <TextCharacterCounter max={maxTootChars} text={text} />
              <VisualCharacterCounter max={maxTootChars} text={text} />
            </HStack>
          )}

          <Button type='submit' theme='primary' icon={publishIcon} text={publishText} disabled={!canSubmit} />
        </HStack>
      </div>
    </Stack>
  );
};

export default ComposeForm;
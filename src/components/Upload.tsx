import bookIcon from '@tabler/icons/book.svg';
import fileCodeIcon from '@tabler/icons/file-code.svg';
import fileSpreadsheetIcon from '@tabler/icons/file-spreadsheet.svg';
import fileTextIcon from '@tabler/icons/file-text.svg';
import fileZipIcon from '@tabler/icons/file-zip.svg';
import defaultIcon from '@tabler/icons/paperclip.svg';
import presentationIcon from '@tabler/icons/presentation.svg';
import xIcon from '@tabler/icons/x.svg';
import zoomInIcon from '@tabler/icons/zoom-in.svg';
import clsx from 'clsx';
import { List as ImmutableList } from 'immutable';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { spring } from 'react-motion';

import { openModal } from 'src/actions/modals';
import { Blurhash, HStack, Icon, IconButton } from 'src/components';
import Motion from 'src/utils/optional-motion';
import { useAppDispatch } from 'src/hooks';
import { Attachment } from 'src/types/entities';

export const MIMETYPE_ICONS: Record<string, string> = {
  'application/x-freearc': fileZipIcon,
  'application/x-bzip': fileZipIcon,
  'application/x-bzip2': fileZipIcon,
  'application/gzip': fileZipIcon,
  'application/vnd.rar': fileZipIcon,
  'application/x-tar': fileZipIcon,
  'application/zip': fileZipIcon,
  'application/x-7z-compressed': fileZipIcon,
  'application/x-csh': fileCodeIcon,
  'application/html': fileCodeIcon,
  'text/javascript': fileCodeIcon,
  'application/json': fileCodeIcon,
  'application/ld+json': fileCodeIcon,
  'application/x-httpd-php': fileCodeIcon,
  'application/x-sh': fileCodeIcon,
  'application/xhtml+xml': fileCodeIcon,
  'application/xml': fileCodeIcon,
  'application/epub+zip': bookIcon,
  'application/vnd.oasis.opendocument.spreadsheet': fileSpreadsheetIcon,
  'application/vnd.ms-excel': fileSpreadsheetIcon,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': fileSpreadsheetIcon,
  'application/pdf': fileTextIcon,
  'application/vnd.oasis.opendocument.presentation': presentationIcon,
  'application/vnd.ms-powerpoint': presentationIcon,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': presentationIcon,
  'text/plain': fileTextIcon,
  'application/rtf': fileTextIcon,
  'application/msword': fileTextIcon,
  'application/x-abiword': fileTextIcon,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': fileTextIcon,
  'application/vnd.oasis.opendocument.text': fileTextIcon,
};

const messages = defineMessages({
  description: { id: 'upload_form.description', defaultMessage: 'Describe for the visually impaired' },
  delete: { id: 'upload_form.undo', defaultMessage: 'Delete' },
  preview: { id: 'upload_form.preview', defaultMessage: 'Preview' },
});

interface IUpload {
  media: Attachment;
  onSubmit?(): void;
  onDelete?(): void;
  onDescriptionChange?(description: string): void;
  descriptionLimit?: number;
  withPreview?: boolean;
}

const Upload: React.FC<IUpload> = ({
  media,
  onSubmit,
  onDelete,
  onDescriptionChange,
  descriptionLimit,
  withPreview = true,
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dirtyDescription, setDirtyDescription] = useState<string | null>(null);

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (onSubmit && e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      handleInputBlur();
      onSubmit();
    }
  };

  const handleUndoClick: React.MouseEventHandler = e => {
    if (onDelete) {
      e.stopPropagation();
      onDelete();
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    setDirtyDescription(e.target.value);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleInputFocus = () => {
    setFocused(true);
  };

  const handleClick = () => {
    setFocused(true);
  };

  const handleInputBlur = () => {
    setFocused(false);
    setDirtyDescription(null);

    if (dirtyDescription !== null && onDescriptionChange) {
      onDescriptionChange(dirtyDescription);
    }
  };

  const handleOpenModal = () => {
    dispatch(openModal('MEDIA', { media: ImmutableList.of(media), index: 0 }));
  };

  const active = hovered || focused;
  const description = dirtyDescription || (dirtyDescription !== '' && media.description) || '';
  const focusX = media.meta.getIn(['focus', 'x']) as number | undefined;
  const focusY = media.meta.getIn(['focus', 'y']) as number | undefined;
  const x = focusX ? ((focusX /  2) + .5) * 100 : undefined;
  const y = focusY ? ((focusY / -2) + .5) * 100 : undefined;
  const mediaType = media.type;
  const mimeType = undefined; // TODO: This might cause issues

  const uploadIcon = mediaType === 'unknown' && (
    <Icon
      className='mx-auto my-12 h-16 w-16 text-gray-800 dark:text-gray-200'
      src={MIMETYPE_ICONS[mimeType || ''] || defaultIcon}
    />
  );

  return (
    <div className='compose-form__upload' tabIndex={0} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} role='button'>
      <Blurhash hash={media.blurhash} className='media-gallery__preview' />
      <Motion defaultStyle={{ scale: 0.8 }} style={{ scale: spring(1, { stiffness: 180, damping: 12 }) }}>
        {({ scale }) => (
          <div
            className={clsx('compose-form__upload-thumbnail', mediaType)}
            style={{
              transform: `scale(${scale})`,
              backgroundImage: mediaType === 'image' ? `url(${media.preview_url})` : undefined,
              backgroundPosition: typeof x === 'number' && typeof y === 'number' ? `${x}% ${y}%` : undefined }}
          >
            <HStack className='absolute right-2 top-2 z-10' space={2}>
              {(withPreview && mediaType !== 'unknown' && Boolean(media.url)) && (
                <IconButton
                  onClick={handleOpenModal}
                  src={zoomInIcon}
                  theme='dark'
                  className='hover:scale-105 hover:bg-gray-900'
                  iconClassName='h-5 w-5'
                  title={intl.formatMessage(messages.preview)}
                />
              )}
              {onDelete && (
                <IconButton
                  onClick={handleUndoClick}
                  src={xIcon}
                  theme='dark'
                  className='hover:scale-105 hover:bg-gray-900'
                  iconClassName='h-5 w-5'
                  title={intl.formatMessage(messages.delete)}
                />
              )}
            </HStack>

            {onDescriptionChange && (
              <div className={clsx('compose-form__upload-description', { active })}>
                <label>
                  <span style={{ display: 'none' }}>{intl.formatMessage(messages.description)}</span>

                  <textarea
                    placeholder={intl.formatMessage(messages.description)}
                    value={description}
                    maxLength={descriptionLimit}
                    onFocus={handleInputFocus}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                  />
                </label>
              </div>
            )}

            <div className='compose-form__upload-preview'>
              {mediaType === 'video' && (
                <video autoPlay playsInline muted loop>
                  <source src={media.preview_url} />
                </video>
              )}
              {uploadIcon}
            </div>
          </div>
        )}
      </Motion>
    </div>
  );
};

export default Upload;
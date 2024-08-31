import React, { useCallback } from 'react';

import { undoUploadCompose, changeUploadCompose } from 'src/actions/compose';
import Upload from 'src/components/Upload';
import { useAppDispatch, useCompose } from 'src/hooks';

interface IUploadCompose {
  id: string;
  composeId: string;
  onSubmit?(): void;
  onDragStart: (id: string) => void;
  onDragEnter: (id: string) => void;
  onDragEnd: () => void;
}

const UploadCompose: React.FC<IUploadCompose> = ({ composeId, id, onSubmit, onDragStart, onDragEnter, onDragEnd }) => {
  const dispatch = useAppDispatch();

  const media = useCompose(composeId).media_attachments.find(item => item.id === id)!;

  const handleDescriptionChange = (description: string) => {
    dispatch(changeUploadCompose(composeId, media.id, { description }));
  };

  const handleDelete = () => {
    dispatch(undoUploadCompose(composeId, media.id));
  };

  const handleDragStart = useCallback(() => {
    onDragStart(id);
  }, [onDragStart, id]);

  const handleDragEnter = useCallback(() => {
    onDragEnter(id);
  }, [onDragEnter, id]);

  return (
    <Upload
      media={media}
      onDelete={handleDelete}
      onDescriptionChange={handleDescriptionChange}
      onSubmit={onSubmit}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragEnd={onDragEnd}
      descriptionLimit={320}
      withPreview
    />
  );
};

export default UploadCompose;
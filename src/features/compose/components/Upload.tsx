import React from 'react';

import { undoUploadCompose, changeUploadCompose } from 'src/actions/compose';
import { Upload } from 'src/components';
import { useAppDispatch, useCompose } from 'src/hooks';

interface IUploadCompose {
  id: string;
  composeId: string;
  onSubmit?(): void;
}

const UploadCompose: React.FC<IUploadCompose> = ({ composeId, id, onSubmit }) => {
  const dispatch = useAppDispatch();

  const media = useCompose(composeId).media_attachments.find(item => item.id === id)!;
  const descriptionLimit = 80;

  const handleDescriptionChange = (description: string) => {
    dispatch(changeUploadCompose(composeId, media.id, { description }));
  };

  const handleDelete = () => {
    dispatch(undoUploadCompose(composeId, media.id));
  };

  return (
    <Upload
      media={media}
      onDelete={handleDelete}
      onDescriptionChange={handleDescriptionChange}
      onSubmit={onSubmit}
      descriptionLimit={descriptionLimit}
      withPreview
    />
  );
};

export default UploadCompose;
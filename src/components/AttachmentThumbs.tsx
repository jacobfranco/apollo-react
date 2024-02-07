import React, { Suspense } from 'react';

import { openModal } from 'src/actions/modals';
import { MediaGallery } from 'src/features/AsyncComponents';
import { useAppDispatch } from 'src/hooks';

import type { List as ImmutableList } from 'immutable';
import type { Attachment } from 'src/types/entities';

interface IAttachmentThumbs {
  media: ImmutableList<Attachment>;
  onClick?(): void;
  sensitive?: boolean;
}

const AttachmentThumbs = (props: IAttachmentThumbs) => {
  const { media, onClick, sensitive } = props;
  const dispatch = useAppDispatch();

  const fallback = <div className='media-gallery--compact' />;
  const onOpenMedia = (media: ImmutableList<Attachment>, index: number) => dispatch(openModal('MEDIA', { media, index }));

  return (
    <div className='attachment-thumbs'>
      <Suspense fallback={fallback}>
        <MediaGallery
          media={media}
          onOpenMedia={onOpenMedia}
          height={50}
          compact
          sensitive={sensitive}
          visible
        />
      </Suspense>

      {onClick && (
        <div className='attachment-thumbs__clickable-region' onClick={onClick} />
      )}
    </div>
  );
};

export default AttachmentThumbs;
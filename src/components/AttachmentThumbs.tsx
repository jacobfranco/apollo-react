import { Suspense } from "react";

import { openModal } from "src/actions/modals";
import { MediaGallery } from "src/features/AsyncComponents";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { Attachment } from "src/schemas/index";

interface IAttachmentThumbs {
  media: readonly Attachment[];
  onClick?(): void;
  sensitive?: boolean;
}

const AttachmentThumbs = (props: IAttachmentThumbs) => {
  const { media, onClick, sensitive } = props;
  const dispatch = useAppDispatch();

  const fallback = <div className="!h-[50px] bg-transparent" />;
  const onOpenMedia = (media: readonly Attachment[], index: number) =>
    dispatch(openModal("MEDIA", { media, index }));

  return (
    <div className="relative">
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
        <button
          className="absolute inset-0 size-full cursor-pointer"
          onClick={onClick}
          style={{ background: "none", border: "none", padding: 0 }}
        />
      )}
    </div>
  );
};

export default AttachmentThumbs;

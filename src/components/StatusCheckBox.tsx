import clsx from "clsx";
import { Suspense } from "react";

import { toggleStatusReport } from "src/actions/reports";
import StatusContent from "src/components/StatusContent";
import Toggle from "src/components/Toggle";
import { MediaGallery, Video, Audio } from "src/features/AsyncComponents";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { Attachment } from "src/schemas/index";

interface IStatusCheckBox {
  id: string;
  disabled?: boolean;
}

const StatusCheckBox: React.FC<IStatusCheckBox> = ({ id, disabled }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.statuses.get(id));
  const checked = useAppSelector((state) =>
    state.reports.new.status_ids.includes(id)
  );

  const onToggle: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    dispatch(toggleStatusReport(id, e.target.checked));

  const mediaType = status?.media_attachments.get(0)?.type;

  if (!status || status.repost) {
    return null;
  }

  let media;

  if (status.media_attachments.size > 0) {
    if (status.media_attachments.some((item) => item.type === "unknown")) {
      // Do nothing
    } else if (status.media_attachments.get(0)?.type === "video") {
      const video = status.media_attachments.get(0);

      if (video) {
        media = (
          <Video
            preview={video.preview_url}
            blurhash={video.blurhash}
            src={video.url}
            alt={video.description}
            aspectRatio={
              video.meta.getIn(["original", "aspect"]) as number | undefined
            }
            width={239}
            height={110}
            inline
          />
        );
      }
    } else if (status.media_attachments.get(0)?.type === "audio") {
      const audio = status.media_attachments.get(0);

      if (audio) {
        media = <Audio src={audio.url} alt={audio.description} />;
      }
    } else {
      media = (
        <MediaGallery
          media={status.media_attachments.toJS() as unknown as Attachment[]}
          sensitive={status.sensitive}
          height={110}
          onOpenMedia={() => {}}
        />
      );
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="py-2">
        <StatusContent status={status} />
        <Suspense>
          <div
            className={clsx("max-w-[250px]", {
              "mt-2": mediaType === "audio" || mediaType === "video",
            })}
          >
            {media}
          </div>
        </Suspense>
      </div>

      <div className="flex flex-[0_0_auto] items-center justify-center p-2.5">
        <Toggle checked={checked} onChange={onToggle} disabled={disabled} />
      </div>
    </div>
  );
};

export default StatusCheckBox;

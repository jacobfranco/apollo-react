import xIcon from "@tabler/icons/outline/x.svg";
import clsx from "clsx";
import { List as ImmutableList } from "immutable";

import { openModal } from "src/actions/modals";
import Blurhash from "src/components/Blurhash";
import Icon from "src/components/Icon";
import { useAppDispatch } from "src/hooks/useAppDispatch";

import ChatUploadPreview from "./ChatUploadPreview";

import type { Attachment } from "src/types/entities";

interface IChatUpload {
  attachment: Attachment;
  onDelete?(): void;
}

/** An attachment uploaded to the chat composer, before sending. */
const ChatUpload: React.FC<IChatUpload> = ({ attachment, onDelete }) => {
  const dispatch = useAppDispatch();
  const clickable = attachment.type !== "unknown";

  const handleOpenModal = () => {
    dispatch(
      openModal("MEDIA", {
        media: ImmutableList.of(attachment).toJS(),
        index: 0,
      })
    );
  };

  return (
    <div className="relative isolate inline-block size-24 overflow-hidden rounded-lg bg-gray-200 dark:bg-primary-900">
      <Blurhash
        hash={attachment.blurhash}
        className="absolute inset-0 -z-10 size-full"
      />

      <div className="absolute right-[6px] top-[6px]">
        <RemoveButton onClick={onDelete} />
      </div>

      <button
        onClick={clickable ? handleOpenModal : undefined}
        className={clsx("size-full", {
          "cursor-zoom-in": clickable,
          "cursor-default": !clickable,
        })}
      >
        <ChatUploadPreview attachment={attachment} />
      </button>
    </div>
  );
};

interface IRemoveButton {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/** Floating button to remove an attachment. */
const RemoveButton: React.FC<IRemoveButton> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-5 items-center justify-center rounded-full bg-secondary-500 p-1"
    >
      <Icon className="size-3 text-white" src={xIcon} />
    </button>
  );
};

export default ChatUpload;

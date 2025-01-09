import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";

import Video from "src/features/Video";

import type { Status, Account, Attachment } from "src/types/entities";

interface IVideoModal {
  media: Attachment;
  status: Status;
  account: Account;
  time: number;
  onClose: () => void;
}

const VideoModal: React.FC<IVideoModal> = ({
  status,
  account,
  media,
  time,
  onClose,
}) => {
  const history = useHistory();

  const handleStatusClick: React.MouseEventHandler = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      history.push(`/@${account.username}/posts/${status.id}`);
    }
  };

  const link = status && account && (
    <a href={status.url} onClick={handleStatusClick}>
      <FormattedMessage
        id="lightbox.view_context"
        defaultMessage="View context"
      />
    </a>
  );

  return (
    <div className="pointer-events-auto mx-auto block w-full max-w-xl overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
      <Video
        preview={media.preview_url}
        blurhash={media.blurhash}
        src={media.url}
        startTime={time}
        link={link}
        detailed
        autoFocus
        alt={media.description}
        visible
      />
    </div>
  );
};

export default VideoModal;

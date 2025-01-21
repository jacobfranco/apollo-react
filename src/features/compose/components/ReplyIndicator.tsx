import xIcon from "@tabler/icons/outline/x.svg";
import clsx from "clsx";

import AttachmentThumbs from "src/components/AttachmentThumbs";
import Markup from "src/components/Markup";
import Stack from "src/components/Stack";
import AccountContainer from "src/containers/AccountContainer";
import { Status as StatusEntity } from "src/schemas/index";
import { getTextDirection } from "src/utils/rtl";

interface IReplyIndicator {
  className?: string;
  status?: StatusEntity;
  onCancel?: () => void;
  hideActions: boolean;
}

const ReplyIndicator: React.FC<IReplyIndicator> = ({
  className,
  status,
  hideActions,
  onCancel,
}) => {
  const handleClick = () => {
    onCancel!();
  };

  if (!status) {
    return null;
  }

  let actions = {};
  if (!hideActions && onCancel) {
    actions = {
      onActionClick: handleClick,
      actionIcon: xIcon,
      actionAlignment: "top",
      actionTitle: "Dismiss",
    };
  }

  return (
    <Stack
      space={2}
      className={clsx(
        "max-h-72 overflow-y-auto rounded-lg bg-gray-100 p-4 black:bg-gray-900 dark:bg-secondary-800/70",
        className
      )}
    >
      <AccountContainer
        {...actions}
        id={status.account.id}
        timestamp={status.created_at}
        showProfileHoverCard={false}
        withLinkToProfile={false}
        hideActions={hideActions}
      />

      <Markup
        className="break-words"
        size="sm"
        direction={getTextDirection(status.search_index)}
        mentions={status.mentions}
        html={{ __html: status.content }}
      />

      {status.media_attachments.length > 0 && (
        <AttachmentThumbs
          media={status.media_attachments}
          sensitive={status.sensitive}
        />
      )}
    </Stack>
  );
};

export default ReplyIndicator;

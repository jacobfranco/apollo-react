import xIcon from "@tabler/icons/outline/x.svg";
import clsx from "clsx";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

import StatusMedia from "src/components/StatusMedia";
import Stack from "src/components/Stack";
import AccountContainer from "src/containers/AccountContainer";
import { useSettings } from "src/hooks/useSettings.ts";
import { Status as StatusEntity } from "src/schemas/index.ts";
import { defaultMediaVisibility } from "src/utils/status.ts";

import OutlineBox from "./OutlineBox";
import QuotedStatusIndicator from "./QuotedStatusIndicator";
import StatusContent from "./StatusContent";
import StatusReplyMentions from "./StatusReplyMentions";
import SensitiveContentOverlay from "./SensitiveContentOverlay";

import type { Status as LegacyStatus } from "src/types/entities.ts";

const messages = defineMessages({
  cancel: { id: "reply_indicator.cancel", defaultMessage: "Cancel" },
});

interface IQuotedStatus {
  /** The quoted status entity. */
  status?: LegacyStatus;
  /** Callback when cancelled (during compose). */
  onCancel?: Function;
  /** Whether the status is shown in the post composer. */
  compose?: boolean;
}

/** Status embedded in a quote post. */
const QuotedStatus: React.FC<IQuotedStatus> = ({
  status,
  onCancel,
  compose,
}) => {
  const intl = useIntl();
  const history = useHistory();

  const { displayMedia } = useSettings();

  const overlay = useRef<HTMLDivElement>(null);

  const [showMedia, setShowMedia] = useState<boolean>(
    defaultMediaVisibility(status, displayMedia)
  );
  const [minHeight, setMinHeight] = useState(208);

  useEffect(() => {
    if (overlay.current) {
      setMinHeight(overlay.current.getBoundingClientRect().height);
    }
  }, [overlay.current]);

  const handleExpandClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!status) return;
    const account = status.account;

    if (!compose && e.button === 0) {
      const statusUrl = `/@${account.username}/posts/${status.id}`;
      if (!(e.ctrlKey || e.metaKey)) {
        history.push(statusUrl);
      } else {
        window.open(statusUrl, "_blank");
      }
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleToggleMediaVisibility = () => {
    setShowMedia(!showMedia);
  };

  if (!status) {
    return null;
  }

  const account = status.account;

  let actions = {};
  if (onCancel) {
    actions = {
      onActionClick: handleClose,
      actionIcon: xIcon,
      actionAlignment: "top",
      actionTitle: intl.formatMessage(messages.cancel),
    };
  }

  return (
    <OutlineBox
      data-testid="quoted-status"
      className={clsx("cursor-pointer", {
        "hover:bg-gray-100 dark:hover:bg-gray-800": !compose,
      })}
    >
      <Stack space={2} onClick={handleExpandClick}>
        <AccountContainer
          {...actions}
          id={account.id}
          timestamp={status.created_at}
          withRelationship={false}
          showProfileHoverCard={!compose}
          withLinkToProfile={!compose}
        />

        <StatusReplyMentions status={status} hoverable={false} />

        <Stack
          className="relative z-0"
          style={{
            minHeight: status.hidden
              ? Math.max(minHeight, 208) + 12
              : undefined,
          }}
        >
          {status.hidden && (
            <SensitiveContentOverlay
              status={status}
              visible={showMedia}
              onToggleVisibility={handleToggleMediaVisibility}
              ref={overlay}
            />
          )}

          <Stack space={4}>
            <StatusContent status={status} collapsable />

            {status.quote && (
              <QuotedStatusIndicator statusId={status.quote as string} />
            )}

            {status.media_attachments.size > 0 && (
              <StatusMedia
                status={status.toJS() as StatusEntity}
                muted={compose}
                showMedia={showMedia}
                onToggleVisibility={handleToggleMediaVisibility}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </OutlineBox>
  );
};

export default QuotedStatus;

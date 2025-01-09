import clsx from "clsx";

import Account from "src/components/Account";
import AttachmentThumbs from "src/components/AttachmentThumbs";
import StatusContent from "src/components/StatusContent";
import StatusReplyMentions from "src/components/StatusReplyMentions";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import PollPreview from "src/components/PollPreview";
import { useAppSelector } from "src/hooks/useAppSelector";
import { Attachment } from "src/schemas/index";

import { buildStatus } from "src/utils/scheduled-statuses";

import ScheduledStatusActionBar from "./ScheduledStatusActionBar";

import type { Status as StatusEntity } from "src/types/entities";

interface IScheduledStatus {
  statusId: string;
}

const ScheduledStatus: React.FC<IScheduledStatus> = ({
  statusId,
  ...other
}) => {
  const status = useAppSelector((state) => {
    const scheduledStatus = state.scheduled_statuses.get(statusId);
    if (!scheduledStatus) return null;
    return buildStatus(state, scheduledStatus);
  }) as StatusEntity | null;

  if (!status) return null;

  const account = status.account;

  return (
    <div className={clsx("status--wrapper")} tabIndex={0}>
      <div
        className={clsx("status", { "status-reply": !!status.in_reply_to_id })}
        data-id={status.id}
      >
        <div className="mb-4">
          <HStack justifyContent="between" alignItems="start">
            <Account
              key={account.id}
              account={account}
              timestamp={status.created_at}
              futureTimestamp
              action={<ScheduledStatusActionBar status={status} {...other} />}
            />
          </HStack>
        </div>

        <StatusReplyMentions status={status} />

        <Stack space={4}>
          <StatusContent status={status} collapsable />

          {status.media_attachments.size > 0 && (
            <AttachmentThumbs
              media={status.media_attachments.toJS() as unknown as Attachment[]}
              sensitive={status.sensitive}
            />
          )}

          {status.poll && <PollPreview pollId={status.poll as string} />}
        </Stack>
      </div>
    </div>
  );
};

export default ScheduledStatus;

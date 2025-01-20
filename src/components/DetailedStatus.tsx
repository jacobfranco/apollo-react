import circlesIcon from "@tabler/icons/outline/circles.svg";
import lockIcon from "@tabler/icons/outline/lock.svg";
import mailIcon from "@tabler/icons/outline/mail.svg";
import { useEffect, useRef, useState } from "react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import Account from "src/components/Account";
import StatusContent from "src/components/StatusContent";
import StatusMedia from "src/components/StatusMedia";
import StatusReplyMentions from "src/components/StatusReplyMentions";
import SensitiveContentOverlay from "src/components/SensitiveContentOverlay";
import StatusInfo from "src/components/StatusInfo";
import TranslateButton from "src/components/TranslateButton";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import QuotedStatus from "src/containers/StatusQuotedStatusContainer";
import { Status as StatusEntity } from "src/schemas/index";
import { getActualStatus } from "src/utils/status";

import StatusInteractionBar from "./StatusInteractionBar";

import type { Group, Status as LegacyStatus } from "src/types/entities";

interface IDetailedStatus {
  status: LegacyStatus;
  showMedia?: boolean;
  withMedia?: boolean;
  onToggleMediaVisibility: () => void;
}

const DetailedStatus: React.FC<IDetailedStatus> = ({
  status,
  onToggleMediaVisibility,
  showMedia,
  withMedia = true,
}) => {
  const intl = useIntl();

  const node = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const [minHeight, setMinHeight] = useState(208);

  useEffect(() => {
    if (overlay.current) {
      setMinHeight(overlay.current.getBoundingClientRect().height);
    }
  }, [overlay.current]);

  const renderStatusInfo = () => {
    if (status.group) {
      return (
        <div className="mb-4">
          <StatusInfo
            avatarSize={42}
            icon={
              <Icon
                src={circlesIcon}
                className="size-4 text-primary-600 dark:text-accent-blue"
              />
            }
            text={
              <FormattedMessage
                id="status.group"
                defaultMessage="Posted in {group}"
                values={{
                  group: (
                    <Link
                      to={`/group/${(status.group as Group).slug}`}
                      className="hover:underline"
                    >
                      <bdi className="truncate">
                        <strong className="text-gray-800 dark:text-gray-200">
                          <span>{status.group.display_name}</span>
                        </strong>
                      </bdi>
                    </Link>
                  ),
                }}
              />
            }
          />
        </div>
      );
    }
  };

  const actualStatus = getActualStatus(status);
  if (!actualStatus) return null;
  const { account } = actualStatus;
  if (!account || typeof account !== "object") return null;

  const isUnderReview = actualStatus.visibility === "self";
  const isSensitive = actualStatus.hidden;

  let statusTypeIcon = null;

  let quote;

  if (actualStatus.quote) {
    quote = <QuotedStatus statusId={actualStatus.quote as string} />;
  }

  if (actualStatus.visibility === "direct") {
    statusTypeIcon = (
      <Icon
        className="size-4 text-gray-700 dark:text-gray-600"
        src={mailIcon}
      />
    );
  } else if (actualStatus.visibility === "private") {
    statusTypeIcon = (
      <Icon
        className="size-4 text-gray-700 dark:text-gray-600"
        src={lockIcon}
      />
    );
  }

  return (
    <div className="box-border">
      <div ref={node} tabIndex={-1}>
        {renderStatusInfo()}

        <div className="mb-4">
          <Account
            key={account.id}
            account={account}
            avatarSize={42}
            hideActions
            approvalStatus={actualStatus.approval_status}
          />
        </div>

        <StatusReplyMentions status={actualStatus} />

        <Stack
          className="relative z-0"
          style={{
            minHeight:
              isUnderReview || isSensitive
                ? Math.max(minHeight, 208) + 12
                : undefined,
          }}
        >
          {(isUnderReview || isSensitive) && (
            <SensitiveContentOverlay
              status={status}
              visible={showMedia}
              onToggleVisibility={onToggleMediaVisibility}
              ref={overlay}
            />
          )}

          <Stack space={4}>
            <StatusContent status={actualStatus} textSize="lg" translatable />

            <TranslateButton status={actualStatus} />

            {withMedia &&
              (quote ||
                actualStatus.card ||
                actualStatus.media_attachments.size > 0) && (
                <Stack space={4}>
                  <StatusMedia
                    status={actualStatus.toJS() as StatusEntity}
                    showMedia={showMedia}
                    onToggleVisibility={onToggleMediaVisibility}
                  />

                  {quote}
                </Stack>
              )}
          </Stack>
        </Stack>

        <HStack
          justifyContent="between"
          alignItems="center"
          className="py-3"
          wrap
        >
          <StatusInteractionBar status={actualStatus} />

          <HStack space={1} alignItems="center">
            {statusTypeIcon}

            <span>
              <a
                href={actualStatus.url}
                target="_blank"
                rel="noopener"
                className="hover:underline"
              >
                <Text tag="span" theme="muted" size="sm">
                  <FormattedDate
                    value={new Date(actualStatus.created_at)}
                    hour12
                    year="numeric"
                    month="short"
                    day="2-digit"
                    hour="numeric"
                    minute="2-digit"
                  />
                </Text>
              </a>
            </span>
          </HStack>
        </HStack>
      </div>
    </div>
  );
};

export default DetailedStatus;

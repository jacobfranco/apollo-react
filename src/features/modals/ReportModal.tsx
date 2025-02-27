import infoCircleIcon from "@tabler/icons/outline/info-circle.svg";
import { useCallback, useEffect, useMemo, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { blockAccount } from "src/actions/accounts";
import {
  submitReport,
  submitReportSuccess,
  submitReportFail,
  ReportableEntities,
} from "src/actions/reports";
import { expandAccountTimeline } from "src/actions/timelines";
import { useAccount } from "src/api/hooks/index";
import AttachmentThumbs from "src/components/AttachmentThumbs";
import GroupCard from "src/components/GroupCard";
import List, { ListItem } from "src/components/List";
import StatusContent from "src/components/StatusContent";
import Avatar from "src/components/Avatar";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Modal from "src/components/Modal";
import ProgressBar from "src/components/ProgressBar";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import AccountContainer from "src/containers/AccountContainer";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { Attachment } from "src/schemas/index";

import ConfirmationStep from "src/components/ReportConfirmation";
import OtherActionsStep from "src/components/ReportOtherActions";
import ReasonStep from "src/components/ReportReason";

const messages = defineMessages({
  blankslate: {
    id: "report.reason.blankslate",
    defaultMessage: "You have removed all statuses from being selected.",
  },
  done: { id: "report.done", defaultMessage: "Done" },
  next: { id: "report.next", defaultMessage: "Next" },
  submit: { id: "report.submit", defaultMessage: "Submit" },
  reportContext: {
    id: "report.chat_message.context",
    defaultMessage:
      "When reporting a user’s message, the five messages before and five messages after the one selected will be passed along to our moderation team for context.",
  },
  reportMessage: {
    id: "report.chat_message.title",
    defaultMessage: "Report message",
  },
  reportGroup: { id: "report.group.title", defaultMessage: "Report Group" },
  cancel: { id: "common.cancel", defaultMessage: "Cancel" },
  previous: { id: "report.previous", defaultMessage: "Previous" },
});

enum Steps {
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE",
}

const reportSteps = {
  [ReportableEntities.ACCOUNT]: {
    ONE: ReasonStep,
    TWO: OtherActionsStep,
    THREE: ConfirmationStep,
  },
  [ReportableEntities.CHAT_MESSAGE]: {
    ONE: ReasonStep,
    TWO: OtherActionsStep,
    THREE: ConfirmationStep,
  },
  [ReportableEntities.STATUS]: {
    ONE: ReasonStep,
    TWO: OtherActionsStep,
    THREE: ConfirmationStep,
  },
  [ReportableEntities.GROUP]: {
    ONE: ReasonStep,
    TWO: null,
    THREE: ConfirmationStep,
  },
};

const SelectedStatus = ({ statusId }: { statusId: string }) => {
  const status = useAppSelector((state) => state.statuses.get(statusId));

  if (!status) {
    console.log("No status found for ID:", statusId);
    return null;
  }

  if (!status?.account) {
    return null;
  }

  // Extract just the ID from the account object
  const accountId = status.account.id;

  console.log("Status account field:", status.account);

  return (
    <Stack space={2} className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <AccountContainer
        id={accountId}
        showProfileHoverCard={false}
        withLinkToProfile={false}
        timestamp={status.created_at}
        hideActions
      />

      <StatusContent status={status} collapsable />

      {status.media_attachments.size > 0 && (
        <AttachmentThumbs
          media={status.media_attachments.toJS() as unknown as Attachment[]}
          sensitive={status.sensitive}
        />
      )}
    </Stack>
  );
};

interface IReportModal {
  onClose: () => void;
}

const ReportModal = ({ onClose }: IReportModal) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const accountId = useAppSelector((state) => state.reports.new.account_id);
  const { account } = useAccount(accountId || undefined);

  const entityType = useAppSelector((state) => state.reports.new.entityType);
  const isBlocked = useAppSelector((state) => state.reports.new.block);
  const isSubmitting = useAppSelector(
    (state) => state.reports.new.isSubmitting
  );
  const ruleIds = useAppSelector((state) => state.reports.new.rule_ids);
  const selectedStatusIds = useAppSelector(
    (state) => state.reports.new.status_ids
  );
  // selectedChatMessage = useAppSelector((state) => state.reports.new.chat_message);
  const selectedGroup = useAppSelector((state) => state.reports.new.group);

  const shouldRequireRule = true;

  const isReportingAccount = entityType === ReportableEntities.ACCOUNT;
  const isReportingStatus = entityType === ReportableEntities.STATUS;
  const isReportingGroup = entityType === ReportableEntities.GROUP;

  const [currentStep, setCurrentStep] = useState<Steps>(Steps.ONE);

  const handleSubmit = () => {
    dispatch(submitReport())
      .then(() => setCurrentStep(Steps.THREE))
      .catch((error) => dispatch(submitReportFail(error)));

    if (isBlocked && account) {
      dispatch(blockAccount(account.id));
    }
  };

  const renderSelectedStatuses = useCallback(() => {
    switch (selectedStatusIds.size) {
      case 0:
        return (
          <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <Text theme="muted">{intl.formatMessage(messages.blankslate)}</Text>
          </div>
        );
      default:
        return <SelectedStatus statusId={selectedStatusIds.first()} />;
    }
  }, [selectedStatusIds.size]);

  const cancelText = useMemo(() => {
    switch (currentStep) {
      case Steps.ONE:
        return intl.formatMessage(messages.cancel);
      default:
        return intl.formatMessage(messages.previous);
    }
  }, [currentStep]);

  const cancelAction = () => {
    switch (currentStep) {
      case Steps.ONE:
        onClose();
        break;
      case Steps.TWO:
        setCurrentStep(Steps.ONE);
        break;
      default:
        break;
    }
  };

  const confirmationText = useMemo(() => {
    switch (currentStep) {
      case Steps.ONE:
        if (isReportingGroup) {
          return intl.formatMessage(messages.submit);
        } else {
          return intl.formatMessage(messages.next);
        }
      case Steps.TWO:
        if (isReportingGroup) {
          return intl.formatMessage(messages.done);
        } else {
          return intl.formatMessage(messages.submit);
        }
      case Steps.THREE:
        return intl.formatMessage(messages.done);
      default:
        return intl.formatMessage(messages.next);
    }
  }, [currentStep, isReportingGroup]);

  const handleNextStep = () => {
    switch (currentStep) {
      case Steps.ONE:
        if (isReportingGroup) {
          handleSubmit();
        } else {
          setCurrentStep(Steps.TWO);
        }
        break;
      case Steps.TWO:
        if (isReportingGroup) {
          dispatch(submitReportSuccess());
          onClose();
        } else {
          handleSubmit();
        }
        break;
      case Steps.THREE:
        dispatch(submitReportSuccess());
        onClose();
        break;
      default:
        break;
    }
  };

  /*

  const renderSelectedChatMessage = () => {
    if (account) {
      return (
        <Stack space={4}>
          <HStack alignItems='center' space={4} className='rounded-md border border-solid border-gray-400 p-4 dark:border-2 dark:border-gray-800'>
            <div>
              <Avatar src={account.avatar} className='size-8' />
            </div>

            <div className='grow rounded-md bg-gray-200 p-4 dark:bg-primary-800'>
              <Text dangerouslySetInnerHTML={{ __html: selectedChatMessage?.content as string }} />
            </div>
          </HStack>

          <List>
            <ListItem
              label={<Icon src={infoCircleIcon} className='text-gray-600' />}
            >
              <Text size='sm'>{intl.formatMessage(messages.reportContext)}</Text>
            </ListItem>
          </List>
        </Stack>
      );
    }
  };

  */

  const renderSelectedGroup = () => {
    if (selectedGroup) {
      return <GroupCard group={selectedGroup} />;
    }
  };

  const renderSelectedEntity = () => {
    switch (entityType) {
      case ReportableEntities.STATUS:
        return renderSelectedStatuses();
      /*
      case ReportableEntities.CHAT_MESSAGE:
        return renderSelectedChatMessage();
      
      */
      case ReportableEntities.GROUP:
        if (currentStep === Steps.TWO) {
          return null;
        }

        return renderSelectedGroup();
      default:
        return null;
    }
  };

  const renderTitle = () => {
    switch (entityType) {
      case ReportableEntities.CHAT_MESSAGE:
        return intl.formatMessage(messages.reportMessage);
      case ReportableEntities.GROUP:
        return intl.formatMessage(messages.reportGroup);
      default:
        // eslint-disable-next-line formatjs/no-literal-string-in-jsx
        return (
          <FormattedMessage
            id="report.target"
            defaultMessage="Reporting {target}"
            values={{ target: <strong>@{account?.username}</strong> }}
          />
        );
    }
  };

  const isConfirmationButtonDisabled = useMemo(() => {
    if (currentStep === Steps.THREE) {
      return false;
    }

    return (
      isSubmitting ||
      (shouldRequireRule && ruleIds.isEmpty()) ||
      (isReportingStatus && selectedStatusIds.size === 0)
    );
  }, [
    currentStep,
    isSubmitting,
    shouldRequireRule,
    ruleIds,
    selectedStatusIds.size,
    isReportingStatus,
  ]);

  const calculateProgress = useCallback(() => {
    switch (currentStep) {
      case Steps.ONE:
        return 0.33;
      case Steps.TWO:
        return 0.66;
      case Steps.THREE:
        return 1;
      default:
        return 0;
    }
  }, [currentStep]);

  useEffect(() => {
    if (account?.id) {
      dispatch(
        expandAccountTimeline(account.id, { withReplies: true, maxId: null })
      );
    }
  }, [account?.id]);

  if (!account) {
    return null;
  }

  const StepToRender = reportSteps[entityType][currentStep];

  return (
    <Modal
      title={renderTitle()}
      onClose={onClose}
      cancelText={cancelText}
      cancelAction={currentStep === Steps.THREE ? undefined : cancelAction}
      confirmationAction={handleNextStep}
      confirmationText={confirmationText}
      confirmationDisabled={isConfirmationButtonDisabled}
      skipFocus
    >
      <Stack space={4}>
        <ProgressBar progress={calculateProgress()} />

        {currentStep !== Steps.THREE &&
          !isReportingAccount &&
          renderSelectedEntity()}

        {StepToRender && <StepToRender account={account} />}
      </Stack>
    </Modal>
  );
};

export default ReportModal;

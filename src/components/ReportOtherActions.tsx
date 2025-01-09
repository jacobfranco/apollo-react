import arrowsMinimizeIcon from "@tabler/icons/outline/arrows-minimize.svg";
import plusIcon from "@tabler/icons/outline/plus.svg";
import { OrderedSet } from "immutable";
import { useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { changeReportBlock, changeReportForward } from "src/actions/reports";
import Button from "src/components/Button";
import FormGroup from "src/components/FormGroup";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import Toggle from "src/components/Toggle";
import StatusCheckBox from "src/components/StatusCheckBox";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";

import type { Account } from "src/schemas/index";

const messages = defineMessages({
  addAdditionalStatuses: {
    id: "report.other_actions.add_additional",
    defaultMessage: "Would you like to add additional statuses to this report?",
  },
  addMore: { id: "report.other_actions.add_more", defaultMessage: "Add more" },
  furtherActions: {
    id: "report.other_actions.further_actions",
    defaultMessage: "Further actions:",
  },
  hideAdditionalStatuses: {
    id: "report.other_actions.hide_additional",
    defaultMessage: "Hide additional statuses",
  },
  otherStatuses: {
    id: "report.other_actions.other_statuses",
    defaultMessage: "Include other statuses?",
  },
});

interface IOtherActionsStep {
  account: Account;
}

const OtherActionsStep = ({ account }: IOtherActionsStep) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const timeline = useAppSelector((state) =>
    state.timelines.get(`account:${account.id}:with_replies`)
  );
  const statusIds = timeline ? timeline.items : [];

  const isBlocked = useAppSelector((state) => state.reports.new.block);
  const isForward = useAppSelector((state) => state.reports.new.forward);
  const isSubmitting = useAppSelector(
    (state) => state.reports.new.isSubmitting
  );

  const [showAdditionalStatuses, setShowAdditionalStatuses] =
    useState<boolean>(false);

  const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportBlock(event.target.checked));
  };

  const handleForwardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeReportForward(event.target.checked));
  };

  return (
    <Stack space={4}>
      <Stack space={2}>
        <Text tag="h1" size="xl" weight="semibold">
          {intl.formatMessage(messages.otherStatuses)}
        </Text>

        <FormGroup
          labelText={intl.formatMessage(messages.addAdditionalStatuses)}
        >
          {showAdditionalStatuses ? (
            <Stack space={2}>
              <div className="divide-y divide-solid divide-gray-200 dark:divide-gray-800">
                {statusIds.map((statusId) => (
                  <StatusCheckBox id={statusId} key={statusId} />
                ))}
              </div>

              <div>
                <Button
                  icon={arrowsMinimizeIcon}
                  theme="tertiary"
                  size="sm"
                  onClick={() => setShowAdditionalStatuses(false)}
                >
                  {intl.formatMessage(messages.hideAdditionalStatuses)}
                </Button>
              </div>
            </Stack>
          ) : (
            <Button
              icon={plusIcon}
              theme="tertiary"
              size="sm"
              onClick={() => setShowAdditionalStatuses(true)}
            >
              {intl.formatMessage(messages.addMore)}
            </Button>
          )}
        </FormGroup>
      </Stack>

      <Stack space={2}>
        <Text tag="h1" size="xl" weight="semibold">
          {intl.formatMessage(messages.furtherActions)}
        </Text>

        <FormGroup
          labelText={
            <FormattedMessage
              id="report.block_hint"
              defaultMessage="Do you also want to block this account?"
            />
          }
        >
          <HStack space={2} alignItems="center">
            <Toggle
              checked={isBlocked}
              onChange={handleBlockChange}
              id="report-block"
            />

            <Text theme="muted" tag="label" size="sm" htmlFor="report-block">
              <FormattedMessage
                id="report.block"
                defaultMessage="Block {target}"
                values={{ target: `@${account.username}` }}
              />
            </Text>
          </HStack>
        </FormGroup>
      </Stack>
    </Stack>
  );
};

export default OtherActionsStep;

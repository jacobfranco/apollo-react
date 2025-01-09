import React, { useEffect } from "react";
import dotsVerticalIcon from "@tabler/icons/outline/dots-vertical.svg";
import hourglassEmptyIcon from "@tabler/icons/outline/hourglass-empty.svg";
import trashIcon from "@tabler/icons/outline/trash.svg";
import { useCallback, useState } from "react";
import { useIntl, FormattedMessage, defineMessages } from "react-intl";
import { Link } from "react-router-dom";

import { closeReports } from "src/actions/admin";
import { deactivateUserModal, deleteUserModal } from "src/actions/moderation";
import DropdownMenu from "src/components/dropdown-menu/index";
import HoverRefWrapper from "src/components/HoverRefWrapper";
import Accordion from "src/components/Accordion";
import Avatar from "src/components/Avatar";
import Button from "src/components/Button";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { makeGetReport } from "src/selectors";
import toast from "src/toast";

import ReportStatus from "src/components/ReportStatus";

import { List as ImmutableList } from "immutable";
import type { Account, Status } from "src/types/entities";

import { makeGetAccount } from "src/selectors/index";
import { fetchStatus } from "src/actions/statuses";

const getAccount = makeGetAccount();

const messages = defineMessages({
  reportClosed: {
    id: "admin.reports.report_closed_message",
    defaultMessage: "Report on @{name} was closed",
  },
  deactivateUser: {
    id: "admin.users.actions.deactivate_user",
    defaultMessage: "Deactivate @{name}",
  },
  deleteUser: {
    id: "admin.users.actions.delete_user",
    defaultMessage: "Delete @{name}",
  },
});

interface IReport {
  id: string;
}

const Report: React.FC<IReport> = ({ id }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const getReport = useCallback(makeGetReport(), []);

  const report = useAppSelector((state) => getReport(state, id));
  console.log("Report report: " + report);

  const accountId = report?.getIn(["account", "account", "id"]) as string;
  console.log("Report account id:", accountId);
  const targetAccountId = report?.getIn([
    "target_account",
    "account",
    "id",
  ]) as string;
  console.log("Report target account id:", targetAccountId);

  // Use selectors directly with useAppSelector
  const account = useAppSelector((state) =>
    accountId ? getAccount(state, accountId) : null
  );
  const targetAccount = useAppSelector((state) =>
    targetAccountId ? getAccount(state, targetAccountId) : null
  );

  const [accordionExpanded, setAccordionExpanded] = useState(false);
  // Extract status IDs from the report
  const statusIds = report?.get("status_ids") || ImmutableList();

  // Extract statuses
  const statuses = report?.get("statuses") || ImmutableList();

  useEffect(() => {
    if (statusIds.size > 0) {
      statusIds.forEach((statusId) => {
        dispatch(fetchStatus(statusId));
      });
    }
  }, [dispatch, statusIds]);

  if (!report || !account || !targetAccount) return null;

  if (statuses.count() === 0) {
    console.log("No statuses to display for report:", report.id);
  }

  const makeMenu = () => {
    return [
      {
        text: intl.formatMessage(messages.deactivateUser, {
          name: targetAccount.username,
        }),
        action: handleDeactivateUser,
        icon: hourglassEmptyIcon,
      },
      {
        text: intl.formatMessage(messages.deleteUser, {
          name: targetAccount.username,
        }),
        action: handleDeleteUser,
        icon: trashIcon,
        destructive: true,
      },
    ];
  };

  const handleCloseReport = () => {
    dispatch(closeReports([report.id]))
      .then(() => {
        const message = intl.formatMessage(messages.reportClosed, {
          name: targetAccount.username as string,
        });
        toast.success(message);
      })
      .catch(() => {});
  };

  const handleDeactivateUser = () => {
    const accountId = targetAccount.id;
    dispatch(deactivateUserModal(intl, accountId, () => handleCloseReport()));
  };

  const handleDeleteUser = () => {
    const accountId = targetAccount.id as string;
    dispatch(deleteUserModal(intl, accountId, () => handleCloseReport()));
  };

  const handleAccordionToggle = (setting: boolean) => {
    setAccordionExpanded(setting);
  };

  const menu = makeMenu();

  const statusCount = statuses.count();
  const username = targetAccount.username as string;
  const reporterUsername = account.username as string;

  console.log("Report Component - Statuses:", statuses.toJS());

  return (
    <HStack space={3} className="p-3" key={report.id}>
      <HoverRefWrapper accountId={targetAccount.id} inline>
        <Link to={`/@${username}`} title={username}>
          <Avatar
            src={targetAccount.avatar}
            size={32}
            className="overflow-hidden"
          />
        </Link>
      </HoverRefWrapper>

      <Stack space={3} className="overflow-hidden" grow>
        <Text tag="h4" weight="bold">
          <FormattedMessage
            id="admin.reports.report_title"
            defaultMessage="Report on {username}"
            values={{
              username: (
                <HoverRefWrapper accountId={targetAccount.id} inline>
                  <Link to={`/@${username}`} title={username}>
                    @{username}
                  </Link>{" "}
                  {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                </HoverRefWrapper>
              ),
            }}
          />
        </Text>

        {statusCount > 0 && (
          <Accordion
            headline={`Reported posts (${statusCount})`}
            expanded={accordionExpanded}
            onToggle={handleAccordionToggle}
          >
            <Stack space={4}>
              {statuses.map((status, index) => {
                // Narrow the type of `status`
                if (!status || typeof status === "string") {
                  console.warn("Invalid status encountered:", status);
                  return null;
                }

                // Use the `id` property safely
                const statusId = status.get
                  ? status.get("id")
                  : status.id || `status-${index}`;

                return (
                  <ReportStatus
                    key={statusId}
                    report={report}
                    status={status as Status}
                  />
                );
              })}
            </Stack>
          </Accordion>
        )}

        <Stack>
          {(report.comment || "").length > 0 && (
            <Text
              tag="blockquote"
              dangerouslySetInnerHTML={{ __html: report.comment }}
            />
          )}

          <HStack space={1}>
            <Text theme="muted" tag="span">
              &mdash;
            </Text>{" "}
            {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
            <HoverRefWrapper accountId={account.id} inline>
              <Link
                to={`/@${reporterUsername}`}
                title={reporterUsername}
                className="text-primary-600 hover:underline dark:text-accent-blue"
              >
                {" "}
                {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}@
                {reporterUsername}
              </Link>
            </HoverRefWrapper>
          </HStack>
        </Stack>
      </Stack>

      <HStack space={2} alignItems="start" className="flex-none">
        <Button onClick={handleCloseReport}>
          <FormattedMessage
            id="admin.reports.actions.close"
            defaultMessage="Close"
          />
        </Button>

        <DropdownMenu items={menu} src={dotsVerticalIcon} />
      </HStack>
    </HStack>
  );
};

export default Report;

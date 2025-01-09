import dotsVerticalIcon from "@tabler/icons/outline/dots-vertical.svg";
import pencilIcon from "@tabler/icons/outline/pencil.svg";
import trashIcon from "@tabler/icons/outline/trash.svg";
import { useIntl, defineMessages } from "react-intl";

import { deleteStatusModal } from "src/actions/moderation";
import DropdownMenu from "src/components/dropdown-menu/index";
import StatusContent from "src/components/StatusContent";
import StatusMedia from "src/components/StatusMedia";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { Status as StatusEntity } from "src/schemas/index";

import type { AdminReport, Status as LegacyStatus } from "src/types/entities";

const messages = defineMessages({
  viewStatus: {
    id: "admin.reports.actions.view_status",
    defaultMessage: "View post",
  },
  deleteStatus: {
    id: "admin.statuses.actions.delete_status",
    defaultMessage: "Delete post",
  },
});

interface IReportStatus {
  status: LegacyStatus;
  report?: AdminReport;
}

const ReportStatus: React.FC<IReportStatus> = ({ status }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const handleDeleteStatus = () => {
    dispatch(deleteStatusModal(intl, status.id));
  };

  const makeMenu = () => {
    const username = status.getIn(["account", "username"]);

    return [
      {
        text: intl.formatMessage(messages.viewStatus, {
          username: `@${username}`,
        }),
        to: `/@${username}/posts/${status.id}`,
        icon: pencilIcon,
      },
      {
        text: intl.formatMessage(messages.deleteStatus, {
          username: `@${username}`,
        }),
        action: handleDeleteStatus,
        icon: trashIcon,
        destructive: true,
      },
    ];
  };

  const menu = makeMenu();

  return (
    <HStack space={2} alignItems="start">
      <Stack space={2} className="overflow-hidden" grow>
        <StatusContent status={status} />
        <StatusMedia status={status.toJS() as StatusEntity} />
      </Stack>

      <div className="flex-none">
        <DropdownMenu items={menu} src={dotsVerticalIcon} />
      </div>
    </HStack>
  );
};

export default ReportStatus;

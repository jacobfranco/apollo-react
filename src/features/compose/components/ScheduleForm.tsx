import xIcon from "@tabler/icons/outline/x.svg";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { setSchedule, removeSchedule } from "src/actions/compose";
import IconButton from "src/components/IconButton";
import { Datetime } from "src/components/Datetime";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useCompose } from "src/hooks/useCompose";

const messages = defineMessages({
  schedule: { id: "schedule.post_time", defaultMessage: "Post Date/Time" },
  remove: { id: "schedule.remove", defaultMessage: "Remove schedule" },
});

export interface IScheduleForm {
  composeId: string;
}

const ScheduleForm: React.FC<IScheduleForm> = ({ composeId }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const scheduledAt = useCompose(composeId).schedule;
  const active = !!scheduledAt;

  const fiveMinutesFromNow = new Date(new Date().getTime() + 300_000);

  const onSchedule = (date: Date) => {
    dispatch(setSchedule(composeId, date));
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(removeSchedule(composeId));
    e.preventDefault();
  };

  if (!active) {
    return null;
  }

  return (
    <Stack space={2}>
      <Text weight="medium">
        <FormattedMessage
          id="datepicker.hint"
          defaultMessage="Scheduled to post at…"
        />
      </Text>
      <HStack space={2} alignItems="center">
        <Datetime
          onChange={onSchedule}
          value={scheduledAt}
          min={fiveMinutesFromNow}
        />
        <IconButton
          iconClassName="h-4 w-4"
          className="bg-transparent text-gray-400 hover:text-gray-600"
          src={xIcon}
          onClick={handleRemove}
          title={intl.formatMessage(messages.remove)}
        />
      </HStack>
    </Stack>
  );
};

export default ScheduleForm;

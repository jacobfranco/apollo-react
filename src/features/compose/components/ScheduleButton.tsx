import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { addSchedule, removeSchedule } from 'src/actions/compose';
import { useAppDispatch, useCompose } from 'src/hooks';

import ComposeFormButton from './ComposeFormButton';

const messages = defineMessages({
  add_schedule: { id: 'schedule_button.add_schedule', defaultMessage: 'Schedule post for later' },
  remove_schedule: { id: 'schedule_button.remove_schedule', defaultMessage: 'Post immediately' },
});

interface IScheduleButton {
  composeId: string;
  disabled?: boolean;
}

const ScheduleButton: React.FC<IScheduleButton> = ({ composeId, disabled }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const compose = useCompose(composeId);

  const active = !!compose.schedule;
  const unavailable = !!compose.id;

  const handleClick = () => {
    if (active) {
      dispatch(removeSchedule(composeId));
    } else {
      dispatch(addSchedule(composeId));
    }
  };

  if (unavailable) {
    return null;
  }

  return (
    <ComposeFormButton
      icon={require('@tabler/icons/calendar-stats.svg')}
      title={intl.formatMessage(active ? messages.remove_schedule : messages.add_schedule)}
      active={active}
      disabled={disabled}
      onClick={handleClick}
    />
  );
};

export default ScheduleButton;
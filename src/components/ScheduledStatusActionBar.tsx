import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { openModal } from 'src/actions/modals';
import { cancelScheduledStatus } from 'src/actions/scheduled-statuses';
import { getSettings } from 'src/actions/settings';
import { HStack } from 'src/components';
import { useAppDispatch } from 'src/hooks';

import type { Status as StatusEntity } from 'src/types/entities';
import Button from './Button';

const messages = defineMessages({
  cancel: { id: 'scheduled_status.cancel', defaultMessage: 'Cancel' },
  deleteConfirm: { id: 'confirmations.scheduled_status_delete.confirm', defaultMessage: 'Discard' },
  deleteHeading: { id: 'confirmations.scheduled_status_delete.heading', defaultMessage: 'Cancel scheduled post' },
  deleteMessage: { id: 'confirmations.scheduled_status_delete.message', defaultMessage: 'Are you sure you want to discard this scheduled post?' },
});

interface IScheduledStatusActionBar {
  status: StatusEntity;
}

const ScheduledStatusActionBar: React.FC<IScheduledStatusActionBar> = ({ status }) => {
  const intl = useIntl();

  const dispatch = useAppDispatch();

  const handleCancelClick = () => {
    dispatch((_, getState) => {

      const deleteModal = getSettings(getState()).get('deleteModal');
      if (!deleteModal) {
        dispatch(cancelScheduledStatus(status.id));
      } else {
        dispatch(openModal('CONFIRM', {
          icon: require('@tabler/icons/outline/calendar-stats.svg'),
          heading: intl.formatMessage(messages.deleteHeading),
          message: intl.formatMessage(messages.deleteMessage),
          confirm: intl.formatMessage(messages.deleteConfirm),
          onConfirm: () => dispatch(cancelScheduledStatus(status.id)),
        }));
      }
    });
  };

  return (
    <HStack justifyContent='end'>
      <Button theme='danger' size='sm' onClick={handleCancelClick}>
        <FormattedMessage id='scheduled_status.cancel' defaultMessage='Cancel' />
      </Button>
    </HStack>
  );
};

export default ScheduledStatusActionBar;
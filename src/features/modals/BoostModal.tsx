import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { Icon, Modal, Stack, Text } from 'src/components';
import ReplyIndicator from 'src/features/compose/components/ReplyIndicator';

import type { Status as StatusEntity } from 'src/types/entities';

const messages = defineMessages({
  cancel_repost: { id: 'status.cancel_repost_private', defaultMessage: 'Un-repost' },
  repost: { id: 'status.repost', defaultMessage: 'Repost' },
});

interface IBoostModal {
  status: StatusEntity;
  onRepost: (status: StatusEntity) => void;
  onClose: () => void;
}

const BoostModal: React.FC<IBoostModal> = ({ status, onRepost, onClose }) => {
  const intl = useIntl();

  const handleRepost = () => {
    onRepost(status);
    onClose();
  };

  const buttonText = status.reposted ? messages.cancel_repost : messages.repost;

  return (
    <Modal
      title={<FormattedMessage id='boost_modal.title' defaultMessage='Repost?' />}
      confirmationAction={handleRepost}
      confirmationText={intl.formatMessage(buttonText)}
    >
      <Stack space={4}>
        <ReplyIndicator status={status} hideActions />

        <Text>
          <FormattedMessage id='boost_modal.combo' defaultMessage='You can press {combo} to skip this next time' values={{ combo: <span>Shift + <Icon className='inline-block align-middle' src={require('@tabler/icons/repeat.svg')} /></span> }} />
        </Text>
      </Stack>
    </Modal>
  );
};

export default BoostModal;
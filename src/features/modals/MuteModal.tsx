import React from 'react';
import { FormattedMessage } from 'react-intl';

import { muteAccount } from 'src/actions/accounts';
import { closeModal } from 'src/actions/modals';
import { toggleHideNotifications, changeMuteDuration } from 'src/actions/mutes';
import { useAccount } from 'src/api/hooks';
import { Modal, HStack, Stack, Text, Toggle } from 'src/components';
import DurationSelector from 'src/features/compose/components/DurationSelector';
import { useAppDispatch, useAppSelector } from 'src/hooks';

const MuteModal = () => {
  const dispatch = useAppDispatch();

  const accountId = useAppSelector((state) => state.mutes.new.accountId);
  const { account } = useAccount(accountId || undefined);
  const notifications = useAppSelector((state) => state.mutes.new.notifications);
  const duration = useAppSelector((state) => state.mutes.new.duration);
  const mutesDuration = 1000000; // TODO: Change this

  if (!account) return null;

  const handleClick = () => {
    dispatch(closeModal());
    dispatch(muteAccount(account.id, notifications, duration));
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const toggleNotifications = () => {
    dispatch(toggleHideNotifications());
  };

  const handleChangeMuteDuration = (expiresIn: number): void => {
    dispatch(changeMuteDuration(expiresIn));
  };

  const toggleAutoExpire = () => handleChangeMuteDuration(duration ? 0 : 2 * 60 * 60 * 24);

  return (
    <Modal
      title={
        <FormattedMessage
          id='confirmations.mute.heading'
          defaultMessage='Mute @{name}'
          values={{ name: account.username }}
        />
      }
      onClose={handleCancel}
      confirmationAction={handleClick}
      confirmationText={<FormattedMessage id='confirmations.mute.confirm' defaultMessage='Mute' />}
      cancelText={<FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />}
      cancelAction={handleCancel}
    >
      <Stack space={4}>
        <Text>
          <FormattedMessage
            id='confirmations.mute.message'
            defaultMessage='Are you sure you want to mute {name}?'
            values={{ name: <strong className='break-words'>@{account.username}</strong> }}
          />
        </Text>

        <label>
          <HStack alignItems='center' space={2}>
            <Text tag='span' theme='muted'>
              <FormattedMessage id='mute_modal.hide_notifications' defaultMessage='Hide notifications from this user?' />
            </Text>

            <Toggle
              checked={notifications}
              onChange={toggleNotifications}
            />
          </HStack>
        </label>

        {mutesDuration && (
          <>
            <label>
              <HStack alignItems='center' space={2}>
                <Text tag='span'>
                  <FormattedMessage id='mute_modal.auto_expire' defaultMessage='Automatically expire mute?' />
                </Text>

                <Toggle
                  checked={duration !== 0}
                  onChange={toggleAutoExpire}
                />
              </HStack>
            </label>

            {duration !== 0 && (
              <Stack space={2}>
                <Text weight='medium'><FormattedMessage id='mute_modal.duration' defaultMessage='Duration' />: </Text>

                <DurationSelector onDurationChange={handleChangeMuteDuration} />
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
};

export default MuteModal;
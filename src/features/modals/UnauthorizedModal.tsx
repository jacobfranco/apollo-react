import React, { useState } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { Button, Form, Input, Modal, Stack, Text } from 'src/components';
import { useAppSelector, useAppDispatch, useRegistrationStatus } from 'src/hooks';
import { selectAccount } from 'src/selectors';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  accountPlaceholder: { id: 'remote_interaction.account_placeholder', defaultMessage: 'Enter your username@domain you want to act from' },
  userNotFoundError: { id: 'remote_interaction.user_not_found_error', defaultMessage: 'Couldn\'t find given user' },
});

interface IUnauthorizedModal {
  /** Unauthorized action type. */
  action: 'FOLLOW' | 'REPLY' | 'REPOST' | 'LIKE' | 'POLL_VOTE' 
  /** Close event handler. */
  onClose: (modalType: string) => void;
  /** ActivityPub ID of the account OR status being acted upon. */
  ap_id?: string;
  /** Account ID of the account being acted upon. */
  account?: string;
}

/** Modal to display when a logged-out user tries to do something that requires login. */
const UnauthorizedModal: React.FC<IUnauthorizedModal> = ({ action, onClose, account: accountId, ap_id: apId }) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { isOpen } = useRegistrationStatus();

  const username = useAppSelector(state => selectAccount(state, accountId!)?.display_name);

  const [account, setAccount] = useState('');

  const onAccountChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setAccount(e.target.value);
  };

  const onClickClose = () => {
    onClose('UNAUTHORIZED');
  };

  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();
  };

  const onLogin = () => {
    history.push('/login');
    onClickClose();
  };

  const onRegister = () => {
    history.push('/signup');
    onClickClose();
  };


  return (
    <Modal
      title={<FormattedMessage id='unauthorized_modal.title' defaultMessage='Sign up for {site_title}' values={{ site_title: 'Apollo' }} />}
      onClose={onClickClose}
      confirmationAction={onLogin}
      confirmationText={<FormattedMessage id='account.login' defaultMessage='Log in' />}
      secondaryAction={isOpen ? onRegister : undefined}
      secondaryText={isOpen ? <FormattedMessage id='account.register' defaultMessage='Sign up' /> : undefined}
    >
      <Stack>
        <Text>
          <FormattedMessage id='unauthorized_modal.text' defaultMessage='You need to be logged in to do that.' />
        </Text>
      </Stack>
    </Modal>
  );
};

export default UnauthorizedModal;
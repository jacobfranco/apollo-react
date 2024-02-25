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

  const renderRemoteInteractions = () => {
    let header;
    let button;

    if (action === 'FOLLOW') {
      header = <FormattedMessage id='remote_interaction.follow_title' defaultMessage='Follow {user} remotely' values={{ user: username }} />;
      button = <FormattedMessage id='remote_interaction.follow' defaultMessage='Proceed to follow' />;
    } else if (action === 'REPLY') {
      header = <FormattedMessage id='remote_interaction.reply_title' defaultMessage='Reply to a post remotely' />;
      button = <FormattedMessage id='remote_interaction.reply' defaultMessage='Proceed to reply' />;
    } else if (action === 'REPOST') {
      header = <FormattedMessage id='remote_interaction.reblog_title' defaultMessage='Reblog a post remotely' />;
      button = <FormattedMessage id='remote_interaction.reblog' defaultMessage='Proceed to repost' />;
    } else if (action === 'LIKE') {
      header = <FormattedMessage id='remote_interaction.favourite_title' defaultMessage='Like a post remotely' />;
      button = <FormattedMessage id='remote_interaction.favourite' defaultMessage='Proceed to like' />;
    } else if (action === 'POLL_VOTE') {
      header = <FormattedMessage id='remote_interaction.poll_vote_title' defaultMessage='Vote in a poll remotely' />;
      button = <FormattedMessage id='remote_interaction.poll_vote' defaultMessage='Proceed to vote' />;
    }

    return (
      <Modal
        title={header}
        onClose={onClickClose}
        confirmationAction={onLogin}
        confirmationText={<FormattedMessage id='account.login' defaultMessage='Log in' />}
        secondaryAction={isOpen ? onRegister : undefined}
        secondaryText={isOpen ? <FormattedMessage id='account.register' defaultMessage='Sign up' /> : undefined}
      >
        <div className='remote-interaction-modal__content'>
          <Form className='remote-interaction-modal__fields' onSubmit={onSubmit}>
            <Input
              placeholder={intl.formatMessage(messages.accountPlaceholder)}
              name='remote_follow[acct]'
              value={account}
              autoCorrect='off'
              autoCapitalize='off'
              onChange={onAccountChange}
              required
            />
            <Button type='submit' theme='primary'>{button}</Button>
          </Form>
          <div className='remote-interaction-modal__divider'>
            <Text align='center'>
              <FormattedMessage id='remote_interaction.divider' defaultMessage='or' />
            </Text>
          </div>
          {isOpen && (
            <Text size='lg' weight='medium'>
              <FormattedMessage id='unauthorized_modal.title' defaultMessage='Sign up for {site_title}' values={{ site_title: 'Apollo' }} />
            </Text>
          )}
        </div>
      </Modal>
    );
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
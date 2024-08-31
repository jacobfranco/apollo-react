import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { deleteAccount } from 'src/actions/security';
import { Card, CardBody, CardHeader, CardTitle, Form, FormActions, FormGroup, Stack, Text } from 'src/components';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import { useAppDispatch } from 'src/hooks';
import toast from 'src/toast';

const messages = defineMessages({
  passwordFieldLabel: { id: 'security.fields.password.label', defaultMessage: 'Password' },
  deleteHeader: { id: 'security.headers.delete', defaultMessage: 'Delete Account' },
  deleteText: { id: 'security.text.delete.local', defaultMessage: 'To delete your account, enter your password then click Delete Account. This is a permanent action that cannot be undone.' },
  deleteSubmit: { id: 'security.submit.delete', defaultMessage: 'Delete Account' },
  deleteAccountSuccess: { id: 'security.delete_account.success', defaultMessage: 'Account successfully deleted.' },
  deleteAccountFail: { id: 'security.delete_account.fail', defaultMessage: 'Account deletion failed.' },
});

const DeleteAccount = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [password, setPassword] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();

    setPassword(event.target.value);
  }, []);

  const handleSubmit = React.useCallback(() => {
    setLoading(true);
    dispatch(deleteAccount(password)).then(() => {
      setPassword('');
      toast.success(intl.formatMessage(messages.deleteAccountSuccess));
    }).finally(() => {
      setLoading(false);
    }).catch(() => {
      setPassword('');
      toast.error(intl.formatMessage(messages.deleteAccountFail));
    });
  }, [password, dispatch, intl]);

  return (
    <Card variant='rounded'>
      <CardHeader backHref='/settings'>
        <CardTitle title={intl.formatMessage(messages.deleteHeader)} />
      </CardHeader>

      <CardBody>
        <Stack space={4}>
          <Text theme='muted'>

            {intl.formatMessage(messages.deleteText)}
          </Text>

          <Form onSubmit={handleSubmit}>
            <FormGroup labelText={intl.formatMessage(messages.passwordFieldLabel)}>
              <Input
                type='password'
                name='password'
                onChange={handleInputChange}
                value={password}
              />
            </FormGroup>

            <FormActions>
              <Button type='submit' theme='danger' disabled={isLoading}>
                {intl.formatMessage(messages.deleteSubmit)}
              </Button>

            </FormActions>
          </Form>
        </Stack>
      </CardBody>
    </Card >
  );
};

export default DeleteAccount;
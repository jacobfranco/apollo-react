import React, { useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

import { resetPassword } from 'src/actions/security';
import { BigCard } from 'src/components/BigCard';
import { Form, FormActions, FormGroup } from 'src/components';
import { useAppDispatch } from 'src/hooks';
import toast from 'src/toast';
import Input from 'src/components/Input';
import Button from 'src/components/Button';

const messages = defineMessages({
  nicknameOrEmail: { id: 'password_reset.fields.username_placeholder', defaultMessage: 'Email or username' },
  email: { id: 'password_reset.fields.email_placeholder', defaultMessage: 'E-mail address' },
  confirmation: { id: 'password_reset.confirmation', defaultMessage: 'Check your email for confirmation.' },
});

const PasswordReset = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<Element>) => {
    const nicknameOrEmail = (e.target as any).nickname_or_email.value;
    setIsLoading(true);
    dispatch(resetPassword(nicknameOrEmail)).then(() => {
      setIsLoading(false);
      setSuccess(true);
      toast.info(intl.formatMessage(messages.confirmation));
    }).catch(() => {
      setIsLoading(false);
    });
  };

  if (success) return <Redirect to='/' />;

  return (
    <BigCard title={<FormattedMessage id='password_reset.header' defaultMessage='Reset Password' />}>
      <Form onSubmit={handleSubmit}>
        <FormGroup labelText={intl.formatMessage(messages.nicknameOrEmail)}>
          <Input
            type='text'
            name='nickname_or_email'
            placeholder='me@example.com'
            required
          />
        </FormGroup>

        <FormActions>
          <Button type='submit' theme='primary' disabled={isLoading}>
            <FormattedMessage id='password_reset.reset' defaultMessage='Reset Password' />
          </Button>
        </FormActions>
      </Form>
    </BigCard>
  );
};

export default PasswordReset;
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { BigCard } from 'src/components/BigCard';
import SignupForm from './SignupForm';

interface SignupInviteParams {
  token: string;
}

/** Page to signup with an invitation. */
const SignupInvite: React.FC = () => {
  const { token } = useParams<SignupInviteParams>();

  const title = (
    <FormattedMessage
      id='Signup_invite.title'
      defaultMessage="You've been invited to join {siteTitle}!"
      values={{ siteTitle: 'Apollo'}}
    />
  );

  const subtitle = (
    <FormattedMessage
      id='Signup_invite.lead'
      defaultMessage='Complete the form below to create an account.'
    />
  );

  return (
    <BigCard title={title} subtitle={subtitle}>
      <SignupForm inviteToken={token} />
    </BigCard>
  );
};

export default SignupInvite;
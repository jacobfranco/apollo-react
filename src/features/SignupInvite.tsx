import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory, useParams } from "react-router-dom";

import { BigCard } from "src/components/BigCard";
import SignupForm from "./SignupForm";
import { useLoggedIn } from "src/hooks";

interface SignupInviteParams {
  token: string;
}

/** Page to signup with an invitation. */
const SignupInvite: React.FC = () => {
  const { token } = useParams<SignupInviteParams>();
  const { isLoggedIn } = useLoggedIn();
  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/");
    }
  }, [isLoggedIn, history]);

  const title = (
    <FormattedMessage
      id="Signup_invite.title"
      defaultMessage="You've been invited to join {siteTitle}!"
      values={{ siteTitle: "Apollo" }}
    />
  );

  const subtitle = (
    <FormattedMessage
      id="Signup_invite.lead"
      defaultMessage="Complete the form below to create an account."
    />
  );

  return (
    <BigCard title={title} subtitle={subtitle}>
      <SignupForm inviteToken={token} />
    </BigCard>
  );
};

export default SignupInvite;

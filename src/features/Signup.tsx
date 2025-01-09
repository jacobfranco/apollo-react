import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { BigCard } from "src/components/BigCard";
import { Text } from "src/components";
import { useRegistrationStatus } from "src/hooks";
import { useHistory } from "react-router-dom";

import SignupForm from "./SignupForm";

const Signup: React.FC = () => {
  const { isOpen } = useRegistrationStatus();
  const history = useHistory();

  if (!isOpen) {
    return (
      <BigCard
        title={
          <FormattedMessage
            id="registration.closed_title"
            defaultMessage="Registrations Closed"
          />
        }
      >
        <Text theme="muted" align="center">
          <FormattedMessage
            id="registration.closed_message"
            defaultMessage="Apollo is not accepting new members"
          />
        </Text>
      </BigCard>
    );
  }

  return (
    <BigCard
      title={
        <FormattedMessage id="column.registration" defaultMessage="Sign Up" />
      }
    >
      <SignupForm />
    </BigCard>
  );
};

export default Signup;

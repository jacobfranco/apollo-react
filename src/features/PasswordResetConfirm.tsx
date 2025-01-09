import React, { useEffect } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Redirect, useHistory } from "react-router-dom";

import { resetPasswordConfirm } from "src/actions/security";
import { BigCard } from "src/components/BigCard";
import { Form, FormActions, FormGroup } from "src/components";
import { useAppDispatch, useLoggedIn } from "src/hooks";
import Button from "src/components/Button";
import Input from "src/components/Input";

const token = new URLSearchParams(window.location.search).get(
  "reset_password_token"
);

const messages = defineMessages({
  resetPasswordFail: {
    id: "reset_password.fail",
    defaultMessage: "Expired token, please try again.",
  },
  passwordPlaceholder: {
    id: "reset_password.password.placeholder",
    defaultMessage: "Placeholder",
  },
});

const Statuses = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
};

// TODO: This feature might be for truth social mostly, so we might just take this out
const PasswordResetConfirm = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState(Statuses.IDLE);

  const isLoading = status === Statuses.LOADING;

  const { isLoggedIn } = useLoggedIn();
  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/");
    }
  }, [isLoggedIn, history]);

  const handleSubmit: React.FormEventHandler = React.useCallback(
    (event) => {
      event.preventDefault();

      setStatus(Statuses.LOADING);
      dispatch(resetPasswordConfirm(password, token as string))
        .then(() => setStatus(Statuses.SUCCESS))
        .catch(() => setStatus(Statuses.FAIL));
    },
    [password]
  );

  const onChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((event) => {
      setPassword(event.target.value);
    }, []);

  const renderErrors = () => {
    if (status === Statuses.FAIL) {
      return [intl.formatMessage(messages.resetPasswordFail)];
    }

    return [];
  };

  if (status === Statuses.SUCCESS) {
    return <Redirect to="/" />;
  }

  return (
    <BigCard
      title={
        <FormattedMessage
          id="reset_password.header"
          defaultMessage="Set New Password"
        />
      }
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup
          labelText={
            <FormattedMessage
              id="reset_password.password.label"
              defaultMessage="Password"
            />
          }
          errors={renderErrors()}
        >
          <Input
            type="password"
            name="password"
            placeholder={intl.formatMessage(messages.passwordPlaceholder)}
            onChange={onChange}
            required
          />
        </FormGroup>

        <FormActions>
          <Button type="submit" theme="primary" disabled={isLoading}>
            <FormattedMessage
              id="password_reset.reset"
              defaultMessage="Reset Password"
            />
          </Button>
        </FormActions>
      </Form>
    </BigCard>
  );
};

export default PasswordResetConfirm;

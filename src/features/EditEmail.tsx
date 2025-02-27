import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { changeEmail } from "src/actions/security";
import { Form, FormActions, FormGroup } from "src/components";
import { default as Input } from "src/components/Input";
import { default as Button } from "src/components/Button";
import { useAppDispatch } from "src/hooks";
import { Column } from "src/components/Column";
import toast from "src/toast";

const messages = defineMessages({
  header: { id: "edit_email.header", defaultMessage: "Change Email" },
  updateEmailSuccess: {
    id: "security.update_email.success",
    defaultMessage: "Email successfully updated.",
  },
  updateEmailFail: {
    id: "security.update_email.fail",
    defaultMessage: "Update email failed.",
  },
  emailFieldLabel: {
    id: "security.fields.email.label",
    defaultMessage: "Email address",
  },
  emailFieldPlaceholder: {
    id: "edit_email.placeholder",
    defaultMessage: "me@example.com",
  },
  passwordFieldLabel: {
    id: "security.fields.password.label",
    defaultMessage: "Password",
  },
  submit: { id: "security.submit", defaultMessage: "Save changes" },
  cancel: { id: "common.cancel", defaultMessage: "Cancel" },
  invalidEmail: {
    id: "security.email.invalid",
    defaultMessage: "Please enter a valid email address",
  },
});

const initialState = { email: "", password: "" };

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const EditEmail = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [state, setState] = React.useState(initialState);
  const [isLoading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");

  const { email, password } = state;

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((event) => {
      event.persist();
      setState((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
      if (event.target.name === "email") {
        setEmailError("");
      }
    }, []);

  const handleSubmit = React.useCallback(() => {
    if (!isValidEmail(email)) {
      setEmailError(intl.formatMessage(messages.invalidEmail));
      return;
    }

    setLoading(true);
    dispatch(changeEmail(email, password))
      .then(() => {
        setState(initialState);
        toast.success(intl.formatMessage(messages.updateEmailSuccess));
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(() => {
        setState((prevState) => ({ ...prevState, password: "" }));
        toast.error(intl.formatMessage(messages.updateEmailFail));
      });
  }, [email, password, dispatch, intl]);

  return (
    <Column label={intl.formatMessage(messages.header)} backHref="/settings">
      <Form onSubmit={handleSubmit}>
        <FormGroup
          labelText={intl.formatMessage(messages.emailFieldLabel)}
          errors={[emailError]}
        >
          <Input
            type="text"
            placeholder={intl.formatMessage(messages.emailFieldPlaceholder)}
            name="email"
            autoComplete="off"
            onChange={handleInputChange}
            value={email}
          />
        </FormGroup>
        <FormGroup labelText={intl.formatMessage(messages.passwordFieldLabel)}>
          <Input
            type="password"
            name="password"
            onChange={handleInputChange}
            value={password}
          />
        </FormGroup>
        <FormActions>
          <Button to="/settings" theme="tertiary">
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button
            type="submit"
            theme="primary"
            disabled={isLoading || !email || !password}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </FormActions>
      </Form>
    </Column>
  );
};

export default EditEmail;

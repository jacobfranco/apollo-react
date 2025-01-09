import atIcon from "@tabler/icons/outline/at.svg";
import checkIcon from "@tabler/icons/outline/check.svg";
import { debounce } from "es-toolkit";
import { Map as ImmutableMap } from "immutable";
import { useState, useRef, useCallback } from "react";
import { useIntl, FormattedMessage, defineMessages } from "react-intl";
import { Link, useHistory } from "react-router-dom";

import { accountLookup, checkEmail } from "src/actions/accounts";
import { register, verifyCredentials } from "src/actions/auth";
import { openModal } from "src/actions/modals";
import BirthdayInput from "src/components/BirthdayInput";
import Button from "src/components/Button";
import Checkbox from "src/components/Checkbox";
import FormActions from "src/components/FormActions";
import FormGroup from "src/components/FormGroup";
import Form from "src/components/Form";
import Input from "src/components/Input";
import Select from "src/components/Select";
import Textarea from "src/components/Textarea";
import CaptchaField from "src/features/Captcha";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useSettings } from "src/hooks/useSettings";

const messages = defineMessages({
  username: {
    id: "registration.fields.username_placeholder",
    defaultMessage: "Username",
  },
  username_hint: {
    id: "registration.fields.username_hint",
    defaultMessage: "Only letters, numbers, and underscores are allowed.",
  },
  usernameUnavailable: {
    id: "registration.username_unavailable",
    defaultMessage: "Username is already taken.",
  },
  usernameInappropriate: {
    id: "registration.username_inappropriate",
    defaultMessage: "Username contains forbidden words.",
  },
  email: {
    id: "registration.fields.email_placeholder",
    defaultMessage: "E-Mail address",
  },
  emailInvalid: {
    id: "registration.email_invalid",
    defaultMessage: "Please enter a valid email address.",
  },
  password: {
    id: "registration.fields.password_placeholder",
    defaultMessage: "Password",
  },
  // Updated message to emphasize the exact rules in plain language:
  passwordWeak: {
    id: "registration.password_weak",
    defaultMessage:
      "Your password must be at least 8 characters and include uppercase, lowercase, a number, and one special symbol from the following @ # $ ! % * ? & - _ . + ~ . , : ; = ^ . ",
  },
  passwordMismatch: {
    id: "registration.password_mismatch",
    defaultMessage: "Passwords don't match.",
  },
  confirm: {
    id: "registration.fields.confirm_placeholder",
    defaultMessage: "Password (again)",
  },
  agreement: {
    id: "registration.agreement",
    defaultMessage: "I agree to the {tos}.",
  },
  tos: { id: "registration.tos", defaultMessage: "Terms of Service" },
  close: {
    id: "registration.confirmation_modal.close",
    defaultMessage: "Close",
  },
  newsletter: {
    id: "registration.newsletter",
    defaultMessage: "Subscribe to newsletter.",
  },
  needsConfirmationHeader: {
    id: "confirmations.register.needs_confirmation.header",
    defaultMessage: "Confirmation needed",
  },
  needsApprovalHeader: {
    id: "confirmations.register.needs_approval.header",
    defaultMessage: "Approval needed",
  },
  reasonHint: {
    id: "registration.reason_hint",
    defaultMessage: "This will help us review your application",
  },
  under16Error: {
    id: "registration.under16_error",
    defaultMessage: "You must be at least 16 years old to sign up.",
  },
  usernameTooShort: {
    id: "registration.username_too_short",
    defaultMessage: "Username must be at least 3 characters long.",
  },
  emailTaken: {
    id: "registration.email_taken",
    defaultMessage: "Email address is already in use.",
  },
});

interface ISignupForm {
  inviteToken?: string;
}

/** Allows the user to sign up for the website. */
const SignupForm: React.FC<ISignupForm> = ({ inviteToken }) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { locale } = useSettings();

  // States
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [params, setParams] = useState(ImmutableMap<string, any>());
  const [captchaIdempotencyKey, setCaptchaIdempotencyKey] = useState(
    crypto.randomUUID()
  );
  const [usernameUnavailable, setUsernameUnavailable] = useState(false);
  const [usernameInappropriate, setUsernameInappropriate] = useState(false);
  const [usernameInvalidPattern, setUsernameInvalidPattern] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordWeak, setPasswordWeak] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [under16Error, setUnder16Error] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [usernameTooShort, setUsernameTooShort] = useState(false);

  const controllerRef = useRef(new AbortController());

  // Blocked keywords - TODO: Revise
  const forbiddenWords = ["Apollo"];

  // Helper functions
  const refreshController = () => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
    return controllerRef.current;
  };

  const updateParams = (map: any) => {
    setParams(params.merge(ImmutableMap(map)));
  };

  const checkForbiddenWords = (val: string) => {
    return forbiddenWords.some((word) => val.toLowerCase().includes(word));
  };

  const isValidEmail = (val: string) => {
    // Basic RFC5322-like regex for emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const isOldEnough = (birthday: string) => {
    const today = new Date();
    const [year, month, day] = birthday.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const ageDiff = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    let age = ageDiff;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age >= 16;
  };

  const isStrongPassword = (password: string) => {
    // Requires at least 8 characters, a lowercase, an uppercase, a digit,
    // and one symbol from @#$!%*?&-_.+~.,:;=^
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&\-_+~.,:;=^])[A-Za-z\d@#$!%*?&\-_+~.,:;=^]{8,}$/;
    return passwordRegex.test(password);
  };

  // Event handlers
  const onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    updateParams({ [name]: value });
  };

  const onUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const username = e.target.value;
    updateParams({ username });
    setUsernameTooShort(username.length < 3);

    // Reset errors
    setUsernameUnavailable(false);
    setUsernameInappropriate(false);
    setUsernameInvalidPattern(false);

    if (username.length >= 3) {
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setUsernameInvalidPattern(true);
      }
      if (checkForbiddenWords(username)) {
        setUsernameInappropriate(true);
      }
      usernameAvailable(username);
    }
  };

  const onEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const email = e.target.value;
    updateParams({ email });
    setEmailTaken(false);
  };

  const onEmailBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    const currentEmail = params.get("email", "");
    console.log("onEmailBlur called with email:", currentEmail);

    const valid = isValidEmail(currentEmail);
    setEmailInvalid(!valid);

    if (valid) {
      console.log("Checking email availability...");
      checkEmailAvailable(currentEmail);
    }
  };

  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateParams({ [e.target.name]: e.target.checked });
  };

  const onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const password = e.target.value;
    onInputChange(e);

    // Real-time check
    setPasswordWeak(!isStrongPassword(password));

    if (password === passwordConfirmation) {
      setPasswordMismatch(false);
    }
  };

  const onPasswordConfirmChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const password = params.get("password", "");
    const confirmation = e.target.value;
    setPasswordConfirmation(confirmation);

    if (password === confirmation) {
      setPasswordMismatch(false);
    }
  };

  const onPasswordConfirmBlur: React.ChangeEventHandler<
    HTMLInputElement
  > = () => {
    setPasswordMismatch(!passwordsMatch());
  };

  const onBirthdayChange = (birthday: string) => {
    updateParams({ birthday });
    if (!isOldEnough(birthday)) {
      setUnder16Error(true);
    } else {
      setUnder16Error(false);
    }
  };

  const usernameAvailable = useCallback(
    debounce(
      (username: string) => {
        if (usernameInappropriate) return;

        const controller = refreshController();
        dispatch(accountLookup(username, controller.signal))
          .then((account) => {
            setUsernameUnavailable(!!account);
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setUsernameUnavailable(false);
            }
          });
      },
      1000,
      { edges: ["trailing"] }
    ),
    []
  );

  const checkEmailAvailable = (email: string) => {
    console.log("checkEmailAvailable called with:", email);
    const controller = refreshController();
    dispatch(checkEmail(email, controller.signal))
      .then((exists) => {
        console.log("Server returned exists=", exists);
        setEmailTaken(exists);
      })
      .catch((error) => console.error(error));
  };

  const postRegisterAction = ({ access_token }: any) => {
    return dispatch(verifyCredentials(access_token)).then(() => {
      history.push("/");
    });
  };

  const passwordsMatch = () => {
    return params.get("password", "") === passwordConfirmation;
  };

  const onSubmit: React.FormEventHandler = () => {
    // Final checks
    if (usernameTooShort) {
      return;
    }
    if (emailTaken) {
      return;
    }

    if (!passwordsMatch()) {
      setPasswordMismatch(true);
      return;
    }
    if (usernameInappropriate) {
      return;
    }
    if (passwordWeak) {
      return;
    }

    const emailVal = params.get("email", "");
    if (!isValidEmail(emailVal)) {
      setEmailInvalid(true);
      return;
    } else {
      setEmailInvalid(false);
    }

    const birthday = params.get("birthday", "");
    if (birthday && !isOldEnough(birthday)) {
      setUnder16Error(true);
      return;
    }

    const normalParams = params.withMutations((paramMap) => {
      paramMap.set("locale", locale);
      if (inviteToken) {
        paramMap.set("token", inviteToken);
      }
    });

    setSubmissionLoading(true);

    dispatch(register(normalParams.toJS()))
      .then(postRegisterAction)
      .catch(() => {
        setSubmissionLoading(false);
        refreshCaptcha();
      });
  };

  const onCaptchaClick: React.MouseEventHandler = () => {
    refreshCaptcha();
  };

  const onFetchCaptcha = (captcha: ImmutableMap<string, any>) => {
    setCaptchaLoading(false);
    updateParams({
      captcha_token: captcha.get("token"),
      captcha_answer_data: captcha.get("answer_data"),
    });
  };

  const onFetchCaptchaFail = () => {
    setCaptchaLoading(false);
  };

  const refreshCaptcha = () => {
    setCaptchaIdempotencyKey(crypto.randomUUID());
    updateParams({ captcha_solution: "" });
  };

  const isLoading = captchaLoading || submissionLoading;

  return (
    <Form onSubmit={onSubmit} data-testid="registrations-open">
      <fieldset disabled={isLoading} className="space-y-3">
        <>
          <FormGroup
            hintText={intl.formatMessage(messages.username_hint)}
            errors={[
              ...(usernameTooShort
                ? [intl.formatMessage(messages.usernameTooShort)]
                : []),
              ...(usernameUnavailable
                ? [intl.formatMessage(messages.usernameUnavailable)]
                : []),
              ...(usernameInappropriate
                ? [intl.formatMessage(messages.usernameInappropriate)]
                : []),
              ...(usernameInvalidPattern
                ? [
                    "Username must only contain letters, numbers, and underscores.",
                  ]
                : []),
            ].filter(Boolean)}
          >
            <Input
              type="text"
              name="username"
              placeholder={intl.formatMessage(messages.username)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              pattern="^[a-zA-Z0-9_]+$"
              icon={atIcon}
              onChange={onUsernameChange}
              value={params.get("username", "")}
              required
            />
          </FormGroup>

          <FormGroup
            errors={
              emailInvalid
                ? [intl.formatMessage(messages.emailInvalid)]
                : emailTaken
                ? [intl.formatMessage(messages.emailTaken)]
                : undefined
            }
          >
            <Input
              type="email"
              name="email"
              placeholder={intl.formatMessage(messages.email)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              onChange={onEmailChange}
              onBlur={onEmailBlur} // <-- Check email validity on blur
              value={params.get("email", "")}
              required
            />
          </FormGroup>

          {/* Password fields */}
          <>
            <FormGroup
              errors={
                passwordWeak
                  ? [intl.formatMessage(messages.passwordWeak)]
                  : undefined
              }
            >
              <Input
                type="password"
                name="password"
                placeholder={intl.formatMessage(messages.password)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                onChange={onPasswordChange}
                value={params.get("password", "")}
                required
              />
            </FormGroup>

            <FormGroup
              errors={
                passwordMismatch
                  ? [intl.formatMessage(messages.passwordMismatch)]
                  : undefined
              }
            >
              <Input
                type="password"
                name="password_confirmation"
                placeholder={intl.formatMessage(messages.confirm)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                onChange={onPasswordConfirmChange}
                onBlur={onPasswordConfirmBlur}
                value={passwordConfirmation}
                required
              />
            </FormGroup>
          </>

          <FormGroup
            errors={
              under16Error
                ? [intl.formatMessage(messages.under16Error)]
                : undefined
            }
          >
            <BirthdayInput
              value={params.get("birthday")}
              onChange={onBirthdayChange}
              required
            />
          </FormGroup>

          <CaptchaField
            onFetch={onFetchCaptcha}
            onFetchFail={onFetchCaptchaFail}
            onChange={onInputChange}
            onClick={onCaptchaClick}
            idempotencyKey={captchaIdempotencyKey}
            name="captcha_solution"
            value={params.get("captcha_solution", "")}
          />

          <FormGroup
            labelText={intl.formatMessage(messages.agreement, {
              tos: (
                <Link to="/about/tos" target="_blank" key={0}>
                  {intl.formatMessage(messages.tos)}
                </Link>
              ),
            })}
          >
            <Checkbox
              name="agreement"
              onChange={onCheckboxChange}
              checked={params.get("agreement", false)}
              required
            />
          </FormGroup>

          <FormActions>
            <Button type="submit" theme="secondary" size="md">
              <FormattedMessage
                id="registration.sign_up"
                defaultMessage="Sign up"
              />
            </Button>
          </FormActions>
        </>
      </fieldset>
    </Form>
  );
};

export default SignupForm;

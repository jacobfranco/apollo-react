import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Redirect, useHistory } from "react-router-dom";

import {
  logIn,
  verifyCredentials,
  switchAccount,
  MfaRequiredError,
} from "src/actions/auth";
import { closeModal, openModal } from "src/actions/modals";
import { BigCard } from "src/components/BigCard";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";

import LoginForm from "./LoginForm";
import React from "react";

const Login = () => {
  const dispatch = useAppDispatch();

  const me = useAppSelector((state) => state.me);
  const history = useHistory();

  const token = new URLSearchParams(window.location.search).get("token");

  const [isLoading, setIsLoading] = useState(false);

  const [mfaAuthNeeded, setMfaAuthNeeded] = useState(!!token);
  const [mfaToken, setMfaToken] = useState(token || "");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const getFormData = (form: HTMLFormElement) =>
    Object.fromEntries(Array.from(form).map((i: any) => [i.name, i.value]));

  const handleSubmit: React.FormEventHandler = (event) => {
    const { username, password } = getFormData(event.target as HTMLFormElement);
    dispatch(logIn(username, password))
      .then(({ access_token }) =>
        dispatch(verifyCredentials(access_token as string))
      )
      // Refetch the instance for authenticated fetch
      .then(async (account) => {
        return account;
      })
      .then((account: { id: string }) => {
        dispatch(closeModal());
        if (typeof me === "string") {
          dispatch(switchAccount(account.id));
        } else {
          setShouldRedirect(true);
        }
      })
      .catch((error) => {
        if (error instanceof MfaRequiredError) {
          setMfaAuthNeeded(true);
          setMfaToken(error.token);
        }
        setIsLoading(false);
      });
    setIsLoading(true);
    event.preventDefault();
  };

  return (
    <BigCard
      title={
        <FormattedMessage id="login_form.header" defaultMessage="Sign In" />
      }
    >
      <LoginForm handleSubmit={handleSubmit} isLoading={isLoading} />
    </BigCard>
  );
};

export default Login;

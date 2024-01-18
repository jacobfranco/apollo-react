import React, { useState } from 'react';
import { AxiosError } from 'axios'
import { FormattedMessage } from 'react-intl';

import { useAppDispatch, useAppSelector } from 'src/hooks';
import { logIn, verifyCredentials, switchAccount } from 'src/actions/auth';
import { closeModal } from 'src/actions/modals'
import { BigCard } from 'src/components/BigCard'
import LoginForm from './LoginForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'src/components'
import 'src/styles/features/Login.css';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.me);
  const token = new URLSearchParams(window.location.search).get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const getFormData = (form: HTMLFormElement) =>
    Object.fromEntries(
      Array.from(form).map((i: any) => [i.name, i.value]),
    );

  const handleSubmit: React.FormEventHandler = (event) => {
    const { username, password } = getFormData(event.target as HTMLFormElement);
    dispatch(logIn(username, password))
      .then(({ access_token }) => dispatch(verifyCredentials(access_token as string)))
      .then((account: { id: string }) => {
        dispatch(closeModal());
        if (typeof me === 'string') {
          dispatch(switchAccount(account.id));
        } else {
          setShouldRedirect(true);
        }
      }).catch((error: AxiosError) => {
        const data: any = error.response?.data;
        setIsLoading(false);
      });
    setIsLoading(true);
    event.preventDefault();
  };

    return (
    <BigCard title={<FormattedMessage id='login_form.header' defaultMessage='Sign In' />}>
      <LoginForm handleSubmit={handleSubmit} isLoading={isLoading} />
    </BigCard>
  );
};

export default Login;
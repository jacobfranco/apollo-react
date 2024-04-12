import { AxiosError } from "axios";
import { defineMessages } from 'react-intl';

import { AppDispatch, RootState } from "src/store";
import { createAccount } from 'src/actions/accounts';
import { startOnboarding } from 'src/actions/onboarding';
import { fetchMeSuccess, fetchMeFail } from 'src/actions/me';
import { createApp } from 'src/actions/apps';
import { obtainOAuthToken, revokeOAuthToken  } from 'src/actions/oauth';
import { getLoggedInAccount, parseBaseURL } from 'src/utils/auth';
import { queryClient } from 'src/queries/client';
import { selectAccount } from 'src/selectors';
import toast from 'src/toast';
import KVStore from 'src/storage/kv-store';
import sourceCode from 'src/utils/code'
import { unsetSentryAccount } from "src/sentry";

import api, { baseClient } from "src/api";
import { importFetchedAccount } from 'src/actions/importer';

export const SWITCH_ACCOUNT = 'SWITCH_ACCOUNT';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';

export const VERIFY_CREDENTIALS_REQUEST = 'VERIFY_CREDENTIALS_REQUEST';
export const VERIFY_CREDENTIALS_SUCCESS = 'VERIFY_CREDENTIALS_SUCCESS';
export const VERIFY_CREDENTIALS_FAIL    = 'VERIFY_CREDENTIALS_FAIL';

export const AUTH_ACCOUNT_REMEMBER_REQUEST = 'AUTH_ACCOUNT_REMEMBER_REQUEST';
export const AUTH_ACCOUNT_REMEMBER_SUCCESS = 'AUTH_ACCOUNT_REMEMBER_SUCCESS';
export const AUTH_ACCOUNT_REMEMBER_FAIL    = 'AUTH_ACCOUNT_REMEMBER_FAIL';

const noOp = () => new Promise(f => f(undefined));

export const messages = defineMessages({
  loggedOut: { id: 'auth.logged_out', defaultMessage: 'Logged out.' },
  awaitingApproval: { id: 'auth.awaiting_approval', defaultMessage: 'Your account is awaiting approval' },
  invalidCredentials: { id: 'auth.invalid_credentials', defaultMessage: 'Wrong username or password' },
});



export const register = (params: Record<string, any>) =>
  (dispatch: AppDispatch) => {
    params.fullname = params.username;

    return dispatch(createAppAndToken())
      .then(() => dispatch(createAccount(params)))
      .then(({ token }: { token: Record<string, string | number> }) => {
        dispatch(startOnboarding());
        return dispatch(authLoggedIn(token));
      });
  };

  export const logIn = (username: string, password: string) =>
  (dispatch: AppDispatch) => dispatch(getAuthApp()).then(() => {
    return dispatch(createUserToken(username, password));
  }).catch((error: AxiosError) => {
    if ((error.response?.data as any)?.error === 'mfa_required') {
      // If MFA is required, throw the error and handle it in the component.
      throw error;
    } else if ((error.response?.data as any)?.identifier === 'awaiting_approval') {
      toast.error(messages.awaitingApproval);
    } else {
      // Return "wrong password" message.
      toast.error(messages.invalidCredentials);
    }
    throw error;
  })

  export const verifyCredentials = (token: string, accountUrl?: string) => {
    const baseURL = parseBaseURL(accountUrl);
  
    return (dispatch: AppDispatch, getState: () => RootState) => {
      dispatch({ type: VERIFY_CREDENTIALS_REQUEST, token });
  
      return baseClient(token, baseURL).get('/api/accounts/verify_credentials').then(({ data: account }) => {
        dispatch(importFetchedAccount(account));
        dispatch({ type: VERIFY_CREDENTIALS_SUCCESS, token, account });
        if (account.id === getState().me) dispatch(fetchMeSuccess(account));
        return account;
      }).catch(error => {
        if (error?.response?.status === 403 && error?.response?.data?.id) {
          // The user is waitlisted
          const account = error.response.data;
          dispatch(importFetchedAccount(account));
          dispatch({ type: VERIFY_CREDENTIALS_SUCCESS, token, account });
          if (account.id === getState().me) dispatch(fetchMeSuccess(account));
          return account;
        } else {
          if (getState().me === null) dispatch(fetchMeFail(error));
          dispatch({ type: VERIFY_CREDENTIALS_FAIL, token, error });
          throw error;
        }
      });
    };
  };

  export const switchAccount = (accountId: string, background = false) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const account = selectAccount(getState(), accountId);
    // Clear all stored cache from React Query
    queryClient.invalidateQueries();
    queryClient.clear();

    return dispatch({ type: SWITCH_ACCOUNT, account, background });
  };

  const createUserToken = (username: string, password: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const app = getState().auth.app;

    const params = {
      client_id:     app.client_id!,
      client_secret: app.client_secret!,
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'password',
      username:      username,
      password:      password,
      scope:         'read write',
    };

    return dispatch(obtainOAuthToken(params))
      .then((token: Record<string, string | number>) => dispatch(authLoggedIn(token)));
  };

  const createAppAndToken = () =>
  (dispatch: AppDispatch) =>
    dispatch(getAuthApp()).then(() =>
      dispatch(createAppToken()),
    );

    const getAuthApp = () =>
  (dispatch: AppDispatch) => {
      return dispatch(createAuthApp());
  };

  /**
 * Redux thunk action creator that initiates the creation of a new OAuth app for the Apollo API for authentication.
 * Calls createApp with predefined parameters based on sourceCode object.
 * Dispatches AUTH_APP_CREATED action with the created OAuth app details on success.
 */

  const createAuthApp = () => (dispatch: AppDispatch) => {
    const params = {
      client_name:   sourceCode.displayName, 
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes:        'read write', // Define scopes as needed
      website:       sourceCode.homepage, 
    };
  
    return dispatch(createApp(params)).then((app: Record<string, string>) =>
      dispatch({ type: AUTH_APP_CREATED, app }),
    );
  };

  const createAppToken = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const app = getState().auth.app;
  
    const params = {
      client_id:     app.client_id!,
      client_secret: app.client_secret!,
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'client_credentials',
      scope:         'read write', // Define scopes as needed
    };
  
    return dispatch(obtainOAuthToken(params)).then((token: Record<string, string | number>) =>
      dispatch({ type: AUTH_APP_AUTHORIZED, app, token }),
    );
  };

    export const authLoggedIn = (token: Record<string, string | number>) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: AUTH_LOGGED_IN, token });
    return token;
  };

  export const logOut = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const account = getLoggedInAccount(state);

    if (!account || !account.url) return dispatch(noOp); // Check if account or account.url is undefined

    const user = state.auth.users.get(account.url);
    if (!user) return dispatch(noOp); // Check if user is undefined
  
    // Assuming user is of a specific type that includes access_token
    const token = user.access_token;
  
    if (!state.auth.app.client_id || !state.auth.app.client_secret || !token) {
      // Handle missing values
      return dispatch(noOp);
    }
  
    const params = {
      client_id: state.auth.app.client_id,
      client_secret: state.auth.app.client_secret,
      token: token,
    };

    return dispatch(revokeOAuthToken(params))
      .finally(() => {
        // Clear all stored cache from React Query
        queryClient.invalidateQueries();
        queryClient.clear();

        // Clear account from sentry
        unsetSentryAccount();

        dispatch({ type: AUTH_LOGGED_OUT, account });

        toast.success(messages.loggedOut);
      });
  };

  // TODO: Remove and remove all associated functionality
  export const fetchCaptcha = () =>
  (_dispatch: AppDispatch, getState: () => RootState) => {
    return api(getState).get('/api/pleroma/captcha');
  };

  export const fetchOwnAccounts = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    return state.auth.users.forEach((user) => {
      const account = selectAccount(state, user.id);
      if (!account) {
        dispatch(verifyCredentials(user.access_token, user.url))
          .catch(() => console.warn(`Failed to load account: ${user.url}`));
      }
    });
  };

  export const loadCredentials = (token: string, accountUrl: string) =>
  (dispatch: AppDispatch) => dispatch(rememberAuthAccount(accountUrl))
    .finally(() => dispatch(verifyCredentials(token, accountUrl)));

    export const rememberAuthAccount = (accountUrl: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: AUTH_ACCOUNT_REMEMBER_REQUEST, accountUrl });
    return KVStore.getItemOrError(`authAccount:${accountUrl}`).then(account => {
      dispatch(importFetchedAccount(account));
      dispatch({ type: AUTH_ACCOUNT_REMEMBER_SUCCESS, account, accountUrl });
      if (account.id === getState().me) dispatch(fetchMeSuccess(account));
      return account;
    }).catch(error => {
      dispatch({ type: AUTH_ACCOUNT_REMEMBER_FAIL, error, accountUrl, skipAlert: true });
    });
  };
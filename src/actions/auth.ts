import { AppDispatch, RootState } from "src/store";

import { defineMessages } from 'react-intl';
import { createAccount } from 'src/actions/accounts';
import { startOnboarding } from 'src/actions/onboarding';
import { createApp } from 'src/actions/apps';
import { obtainOAuthToken, revokeOAuthToken  } from 'src/actions/oauth';
import { getLoggedInAccount } from 'src/utils/auth';
import { queryClient } from 'src/queries/client';
import toast from 'src/toast';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';

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

  const createAppAndToken = () =>
  (dispatch: AppDispatch) =>
    dispatch(getAuthApp()).then(() =>
      dispatch(createAppToken()),
    );

    const getAuthApp = () =>
  (dispatch: AppDispatch) => {
      return dispatch(createAuthApp());
  };

  const createAuthApp = () => (dispatch: AppDispatch) => {
    const params = {
      client_name:   'Apollo', 
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes:        'read write', // Define scopes as needed
      website:       'http://yoapollo.com', 
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

        dispatch({ type: AUTH_LOGGED_OUT, account });

        toast.success(messages.loggedOut);
      });
  };
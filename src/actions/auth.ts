import { AppDispatch, RootState } from "src/store";

import { createAccount } from 'src/actions/accounts';
import { startOnboarding } from 'src/actions/onboarding';
import { createApp } from 'src/actions/apps';
import { obtainOAuthToken } from 'src/actions/oauth';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';


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
'use strict'

import axios, { AxiosInstance } from 'axios';
import { createSelector } from 'reselect';

import { RootState } from 'src/store';
import * as BuildConfig from 'src/build-config';

import { getAccessToken, getAppToken, isURL, parseBaseURL } from 'src/utils/auth';

const getToken = (state: RootState, authType: string) => {
    return authType === 'app' ? getAppToken(state) : getAccessToken(state);
  };

const maybeParseJSON = (data: string) => {
    try {
      return JSON.parse(data);
    } catch (Exception) {
      return data;
    }
  };

  const getAuthBaseURL = createSelector([
    (state: RootState, me: string | false | null) => state.accounts.getIn([me, 'url']),
    (state: RootState, _me: string | false | null) => state.auth.me,
  ], (accountUrl, authUserUrl) => {
    const baseURL = parseBaseURL(accountUrl) || parseBaseURL(authUserUrl);
    return baseURL !== window.location.origin ? baseURL : '';
  });

/**
  * Base client for HTTP requests.
  * @param {string} accessToken
  * @param {string} baseURL
  * @returns {object} Axios instance
  */
export const baseClient = (accessToken?: string | null, baseURL: string = ''): AxiosInstance => {
    return axios.create({
      // When BACKEND_URL is set, always use it.
      baseURL: isURL(BuildConfig.BACKEND_URL) ? BuildConfig.BACKEND_URL : baseURL,
      headers: Object.assign(accessToken ? {
        'Authorization': `Bearer ${accessToken}`,
      } : {}),
      transformResponse: [maybeParseJSON],
    });
  };
  
  /**
    * Dumb client for grabbing static files.
    * It uses FE_SUBDIRECTORY and parses JSON if possible.
    * No authorization is needed.
    */
  export const staticClient = axios.create({
    baseURL: BuildConfig.FE_SUBDIRECTORY,
    transformResponse: [maybeParseJSON],
  });
  
  /**
    * Stateful API client.
    * Uses credentials from the Redux store if available.
    * @param {function} getState - Must return the Redux state
    * @param {string} authType - Either 'user' or 'app'
    * @returns {object} Axios instance
    */
  export default (getState: () => RootState, authType: string = 'user'): AxiosInstance => {
    const state = getState();
    const accessToken = getToken(state, authType);
    const me = state.me;
    const baseURL = me ? getAuthBaseURL(state, me) : '';
  
    return baseClient(accessToken, baseURL);
  };
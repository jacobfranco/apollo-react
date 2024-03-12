import { AnyAction } from "@reduxjs/toolkit";

import { baseClient } from 'src/api';

export const APP_CREATE_REQUEST = 'APP_CREATE_REQUEST';
export const APP_CREATE_SUCCESS = 'APP_CREATE_SUCCESS';
export const APP_CREATE_FAIL    = 'APP_CREATE_FAIL';

/**
 * Creates a new OAuth application for the Apollo API by sending a POST request to /api/apps.
 * Returns a Promise with the created OAuth app details on success, or rejects with an error.
 * Dispatches Redux actions to track the request state.
 * Called when a new OAuth app needs to be created.
 */

export function createApp(params?: Record<string, string>, baseURL?: string) {
    return (dispatch: React.Dispatch<AnyAction>) => {
      dispatch({ type: APP_CREATE_REQUEST, params });
      return baseClient(null, baseURL).post('/api/apps', params).then(({ data: app }) => {
        dispatch({ type: APP_CREATE_SUCCESS, params, app });
        return app as Record<string, string>;
      }).catch(error => {
        dispatch({ type: APP_CREATE_FAIL, params, error });
        throw error;
      });
    };
  }

  // TODO: Verify App Credentials probably not necessary
import { baseClient } from "src/api";
import { getBaseURL } from "src/utils/state";
import { RootState, AppDispatch } from "src/store";

export const OAUTH_TOKEN_CREATE_REQUEST = "OAUTH_TOKEN_CREATE_REQUEST";
export const OAUTH_TOKEN_CREATE_SUCCESS = "OAUTH_TOKEN_CREATE_SUCCESS";
export const OAUTH_TOKEN_CREATE_FAIL = "OAUTH_TOKEN_CREATE_FAIL";

export const OAUTH_TOKEN_REVOKE_REQUEST = "OAUTH_TOKEN_REVOKE_REQUEST";
export const OAUTH_TOKEN_REVOKE_SUCCESS = "OAUTH_TOKEN_REVOKE_SUCCESS";
export const OAUTH_TOKEN_REVOKE_FAIL = "OAUTH_TOKEN_REVOKE_FAIL";

export const obtainOAuthToken =
  (params: Record<string, unknown>, baseURL?: string) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: OAUTH_TOKEN_CREATE_REQUEST, params });
    return baseClient(null, baseURL)
      .post("/oauth/token", params)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        dispatch({
          type: OAUTH_TOKEN_CREATE_FAIL,
          params,
          error,
          skipAlert: true,
        });
        throw error;
      });
  };

export const revokeOAuthToken =
  (params: Record<string, string>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: OAUTH_TOKEN_REVOKE_REQUEST, params });
    const baseURL = getBaseURL(getState());
    return baseClient(null, baseURL)
      .post("/oauth/revoke", params)
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: OAUTH_TOKEN_REVOKE_SUCCESS, params, data });
        return data;
      })
      .catch((error) => {
        dispatch({ type: OAUTH_TOKEN_REVOKE_FAIL, params, error });
        throw error;
      });
  };

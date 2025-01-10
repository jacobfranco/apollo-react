import { createSelector } from "reselect";

import { ApolloClient } from "src/api/ApolloClient";
import * as BuildConfig from "src/build-config";
import { selectAccount } from "src/selectors";
import { RootState } from "src/store";
import { getAccessToken, getAppToken, parseBaseURL } from "src/utils/auth";

const getToken = (state: RootState, authType: string) => {
  return authType === "app" ? getAppToken(state) : getAccessToken(state);
};

const getAuthBaseURL = createSelector(
  [
    (state: RootState, me: string | false | null) =>
      me ? selectAccount(state, me)?.url : undefined,
    (state: RootState, _me: string | false | null) => state.auth.me,
  ],
  (accountUrl, authUserUrl) => {
    return parseBaseURL(accountUrl) || parseBaseURL(authUserUrl);
  }
);

/** Base client for HTTP requests. */
export const baseClient = (
  accessToken?: string | null,
  baseURL?: string
): ApolloClient => {
  return new ApolloClient(
    BuildConfig.BACKEND_URL || location.origin,
    accessToken || undefined
  );
};

/**
 * Stateful API client.
 * Uses credentials from the Redux store if available.
 */
export default (
  getState: () => RootState,
  authType: string = "user"
): ApolloClient => {
  const state = getState();
  const accessToken = getToken(state, authType);
  const me = state.me;
  const baseURL =
    BuildConfig.BACKEND_URL ||
    (me ? getAuthBaseURL(state, me) : undefined) ||
    location.origin;

  console.log("Creating client with:", { accessToken, baseURL, me });
  return baseClient(accessToken, baseURL);
};

import { selectAccount } from "src/selectors/index";
import { setSentryAccount } from "src/sentry";
import { getAuthUserId, getAuthUserUrl } from "src/utils/auth";

import api from "../api";

import { verifyCredentials } from "./auth";
import { importFetchedAccount } from "./importer";

import type { Account } from "src/schemas/index";
import type { AppDispatch, RootState } from "src/store";
import type { APIEntity } from "src/types/entities";

const ME_FETCH_REQUEST = "ME_FETCH_REQUEST" as const;
const ME_FETCH_SUCCESS = "ME_FETCH_SUCCESS" as const;
const ME_FETCH_FAIL = "ME_FETCH_FAIL" as const;
const ME_FETCH_SKIP = "ME_FETCH_SKIP" as const;

const ME_PATCH_REQUEST = "ME_PATCH_REQUEST" as const;
const ME_PATCH_SUCCESS = "ME_PATCH_SUCCESS" as const;
const ME_PATCH_FAIL = "ME_PATCH_FAIL" as const;

const noOp = () => new Promise((f) => f(undefined));

const getMeId = (state: RootState) => state.me || getAuthUserId(state);

const getMeUrl = (state: RootState) => {
  const accountId = getMeId(state);
  if (accountId) {
    return selectAccount(state, accountId)?.url || getAuthUserUrl(state);
  }
};

function getMeToken(state: RootState): string | undefined {
  // Fallback for upgrading IDs to URLs
  const accountUrl = getMeUrl(state) || state.auth.me;
  return state.auth.users[accountUrl!]?.access_token;
}

const fetchMe = () => (dispatch: AppDispatch, getState: () => RootState) => {
  console.log("fetchMe: started");

  const state = getState();
  const token = getMeToken(state);
  const accountUrl = getMeUrl(state);

  console.log("fetchMe: token =", token, "accountUrl =", accountUrl);

  if (!token) {
    console.log("fetchMe: No token found, skipping fetch...");
    dispatch({ type: ME_FETCH_SKIP });
    return noOp();
  }

  console.log("fetchMe: Dispatching fetchMeRequest");
  dispatch(fetchMeRequest());

  // verifyCredentials should return a promise
  console.log("actions/me.ts - fetchMe- calling verify credentials");
  return dispatch(verifyCredentials(token, accountUrl!))
    .then((response: any) => {
      console.log("fetchMe: verifyCredentials response:", response);
      return response;
    })
    .catch((error) => {
      console.error("fetchMe: verifyCredentials failed:", error);
      return dispatch(fetchMeFail(error));
    });
};

const patchMe =
  (params: Record<string, any> | FormData) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(patchMeRequest());

    return api(getState)
      .patch("/api/accounts/update_credentials", params)
      .then((response) => response.json())
      .then((data) => {
        dispatch(patchMeSuccess(data));
      })
      .catch((error) => {
        dispatch(patchMeFail(error));
        throw error;
      });
  };

const fetchMeRequest = () => ({
  type: ME_FETCH_REQUEST,
});

const fetchMeSuccess = (account: Account) => {
  setSentryAccount(account);

  return {
    type: ME_FETCH_SUCCESS,
    me: account,
  };
};

const fetchMeFail = (error: APIEntity) => ({
  type: ME_FETCH_FAIL,
  error,
  skipAlert: true,
});

const patchMeRequest = () => ({
  type: ME_PATCH_REQUEST,
});

interface MePatchSuccessAction {
  type: typeof ME_PATCH_SUCCESS;
  me: APIEntity;
}

const patchMeSuccess = (me: APIEntity) => (dispatch: AppDispatch) => {
  const action: MePatchSuccessAction = {
    type: ME_PATCH_SUCCESS,
    me,
  };

  dispatch(importFetchedAccount(me));
  dispatch(action);
};

const patchMeFail = (error: unknown) => ({
  type: ME_PATCH_FAIL,
  error,
  skipAlert: true,
});

type MeAction =
  | ReturnType<typeof fetchMeRequest>
  | ReturnType<typeof fetchMeSuccess>
  | ReturnType<typeof fetchMeFail>
  | ReturnType<typeof patchMeRequest>
  | MePatchSuccessAction
  | ReturnType<typeof patchMeFail>;

export {
  ME_FETCH_REQUEST,
  ME_FETCH_SUCCESS,
  ME_FETCH_FAIL,
  ME_FETCH_SKIP,
  ME_PATCH_REQUEST,
  ME_PATCH_SUCCESS,
  ME_PATCH_FAIL,
  fetchMe,
  patchMe,
  fetchMeRequest,
  fetchMeSuccess,
  fetchMeFail,
  patchMeRequest,
  patchMeSuccess,
  patchMeFail,
  type MeAction,
};

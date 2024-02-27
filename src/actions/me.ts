import { selectAccount } from 'src/selectors';
import { setSentryAccount } from 'src/sentry'; 
import KVStore from 'src/storage/kv-store';
import { getAuthUserId, getAuthUserUrl } from 'src/utils/auth';

import api from 'src/api';

import { loadCredentials } from './auth';
import { importFetchedAccount } from './importer';

import type { RawAxiosRequestHeaders } from 'axios';
import type { Account } from 'src/schemas';
import type { AppDispatch, RootState } from 'src/store';
import type { APIEntity } from 'src/types/entities';

const ME_FETCH_REQUEST = 'ME_FETCH_REQUEST' as const;
const ME_FETCH_SUCCESS = 'ME_FETCH_SUCCESS' as const;
const ME_FETCH_FAIL    = 'ME_FETCH_FAIL' as const;
const ME_FETCH_SKIP    = 'ME_FETCH_SKIP' as const;

const ME_PATCH_REQUEST = 'ME_PATCH_REQUEST' as const;
const ME_PATCH_SUCCESS = 'ME_PATCH_SUCCESS' as const;
const ME_PATCH_FAIL    = 'ME_PATCH_FAIL' as const;

const noOp = () => new Promise(f => f(undefined));

const getMeId = (state: RootState) => state.me || getAuthUserId(state);

const getMeUrl = (state: RootState) => {
  const accountId = getMeId(state);
  if (accountId) {
    return selectAccount(state, accountId)?.url || getAuthUserUrl(state);
  }
};

const getMeToken = (state: RootState) => {
  // Fallback for upgrading IDs to URLs
  const accountUrl = getMeUrl(state) || state.auth.me;
  return state.auth.users.get(accountUrl!)?.access_token;
};

const fetchMe = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const token = getMeToken(state);
    const accountUrl = getMeUrl(state);

    if (!token) {
      dispatch({ type: ME_FETCH_SKIP });
      return noOp();
    }

    dispatch(fetchMeRequest());
    return dispatch(loadCredentials(token, accountUrl!))
      .catch(error => dispatch(fetchMeFail(error)));
  };

const persistAuthAccount = (account: APIEntity, params: Record<string, any>) => {
  if (account && account.url) {
    KVStore.setItem(`authAccount:${account.url}`, account).catch(console.error);
  }
};

const patchMe = (params: Record<string, any>, isFormData = false) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(patchMeRequest());

    const headers: RawAxiosRequestHeaders = isFormData ? {
      'Content-Type': 'multipart/form-data',
    } : {};

    return api(getState)
      .patch('/api/v1/accounts/update_credentials', params, { headers })
      .then(response => {
        persistAuthAccount(response.data, params);
        dispatch(patchMeSuccess(response.data));
      }).catch(error => {
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

const patchMeSuccess = (me: APIEntity) =>
  (dispatch: AppDispatch) => {
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
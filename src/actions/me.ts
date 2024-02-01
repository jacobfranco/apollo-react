import { selectAccount } from 'src/selectors';

import type { Account } from 'src/schemas';
import { AppDispatch, RootState } from 'src/store';
import type { APIEntity } from 'src/types/entities';
import { getAuthUserId, getAuthUserUrl } from 'src/utils/auth';
import { loadCredentials } from 'src/actions/auth';

const ME_FETCH_REQUEST = 'ME_FETCH_REQUEST' as const;
const ME_FETCH_SUCCESS = 'ME_FETCH_SUCCESS' as const;
const ME_FETCH_FAIL    = 'ME_FETCH_FAIL' as const;
const ME_FETCH_SKIP    = 'ME_FETCH_SKIP' as const;

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

  const fetchMeRequest = () => ({
    type: ME_FETCH_REQUEST,
  });

const fetchMeSuccess = (account: Account) => {
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

  export {
    ME_FETCH_REQUEST,
    ME_FETCH_SUCCESS,
    ME_FETCH_FAIL,
    ME_FETCH_SKIP,
    fetchMe,
    fetchMeRequest,
    fetchMeSuccess,
    fetchMeFail,
  };
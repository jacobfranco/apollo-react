import { AppDispatch, RootState } from "src/store";
import api from 'src/api'
import { importFetchedAccount } from "./importer";
import { CancelToken } from "axios";

const ACCOUNT_CREATE_REQUEST = 'ACCOUNT_CREATE_REQUEST';
const ACCOUNT_CREATE_SUCCESS = 'ACCOUNT_CREATE_SUCCESS';
const ACCOUNT_CREATE_FAIL    = 'ACCOUNT_CREATE_FAIL';

const ACCOUNT_LOOKUP_REQUEST = 'ACCOUNT_LOOKUP_REQUEST';
const ACCOUNT_LOOKUP_SUCCESS = 'ACCOUNT_LOOKUP_SUCCESS';
const ACCOUNT_LOOKUP_FAIL    = 'ACCOUNT_LOOKUP_FAIL';

const createAccount = (params: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ACCOUNT_CREATE_REQUEST, params });
    return api(getState, 'app').post('/api/v1/accounts', params).then(({ data: token }) => {
      return dispatch({ type: ACCOUNT_CREATE_SUCCESS, params, token });
    }).catch(error => {
      dispatch({ type: ACCOUNT_CREATE_FAIL, error, params });
      throw error;
    });
  };

  const accountLookup = (acct: string, cancelToken?: CancelToken) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ACCOUNT_LOOKUP_REQUEST, acct });
    return api(getState).get('/api/v1/accounts/lookup', { params: { acct }, cancelToken }).then(({ data: account }) => {
      if (account && account.id) dispatch(importFetchedAccount(account));
      dispatch({ type: ACCOUNT_LOOKUP_SUCCESS, account });
      return account;
    }).catch(error => {
      dispatch({ type: ACCOUNT_LOOKUP_FAIL });
      throw error;
    });
  };

export {
    ACCOUNT_CREATE_REQUEST,
    ACCOUNT_CREATE_SUCCESS,
    ACCOUNT_CREATE_FAIL,
    ACCOUNT_LOOKUP_REQUEST,
    ACCOUNT_LOOKUP_SUCCESS,
    ACCOUNT_LOOKUP_FAIL,
    createAccount,
    accountLookup
}
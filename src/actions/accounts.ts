import { AppDispatch, RootState } from "src/store";
import api from 'src/api'

const ACCOUNT_CREATE_REQUEST = 'ACCOUNT_CREATE_REQUEST';
const ACCOUNT_CREATE_SUCCESS = 'ACCOUNT_CREATE_SUCCESS';
const ACCOUNT_CREATE_FAIL    = 'ACCOUNT_CREATE_FAIL';

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

export {
    ACCOUNT_CREATE_REQUEST,
    ACCOUNT_CREATE_SUCCESS,
    ACCOUNT_CREATE_FAIL,
    createAccount
}
import api from "src/api";
import { AppDispatch, RootState } from "src/store";
import { normalizeUsername } from 'src/utils/input';

const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
const RESET_PASSWORD_FAIL    = 'RESET_PASSWORD_FAIL';

const RESET_PASSWORD_CONFIRM_REQUEST = 'RESET_PASSWORD_CONFIRM_REQUEST';
const RESET_PASSWORD_CONFIRM_SUCCESS = 'RESET_PASSWORD_CONFIRM_SUCCESS';
const RESET_PASSWORD_CONFIRM_FAIL    = 'RESET_PASSWORD_CONFIRM_FAIL';

const resetPassword = (usernameOrEmail: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const input = normalizeUsername(usernameOrEmail);
    const state = getState();

    dispatch({ type: RESET_PASSWORD_REQUEST });

    const params =
      input.includes('@')
        ? { email: input }
        : { nickname: input, username: input };

    const endpoint = '/auth/password';

    return api(getState).post(endpoint, params).then(() => {
      dispatch({ type: RESET_PASSWORD_SUCCESS });
    }).catch(error => {
      dispatch({ type: RESET_PASSWORD_FAIL, error });
      throw error;
    });
  };

  // TODO: Maybe take this out ? I think its just for truth social 
const resetPasswordConfirm = (password: string, token: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const params = { password, reset_password_token: token };
    dispatch({ type: RESET_PASSWORD_CONFIRM_REQUEST });

    return api(getState).post('/api/v1/truth/password_reset/confirm', params).then(() => {
      dispatch({ type: RESET_PASSWORD_CONFIRM_SUCCESS });
    }).catch(error => {
      dispatch({ type: RESET_PASSWORD_CONFIRM_FAIL, error });
      throw error;
    });
  };

  // TODO: Maybe refactor this because of truth social
  const confirmChangedEmail = (token: string) =>
  (_dispatch: AppDispatch, getState: () => RootState) =>
    api(getState).get(`/api/v1/truth/email/confirm?confirmation_token=${token}`);

    // TODO: Implement other functions as needed

  export {
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_REQUEST,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    resetPassword,
    resetPasswordConfirm,
    confirmChangedEmail
  }
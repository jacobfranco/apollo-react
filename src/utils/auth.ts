import { selectAccount, selectOwnAccount } from "src/selectors";
import { RootState } from "src/store";

export const validId = (id: any) => typeof id === 'string' && id !== 'null' && id !== 'undefined';

export const isURL = (url?: string | null) => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getAppToken = (state: RootState) => state.auth.app.access_token as string;

export const getUserToken = (state: RootState, accountId?: string | false | null) => {
  if (!accountId) return;
  const accountUrl = selectAccount(state, accountId)?.url;
  if (!accountUrl) return;
  return state.auth.users.get(accountUrl)?.access_token;
};

export const getAccessToken = (state: RootState) => {
  const me = state.me;
  return getUserToken(state, me);
};

export const parseBaseURL = (url: any) => {
    try {
      return new URL(url).origin;
    } catch {
      return '';
    }
  };

  export const getLoggedInAccount = (state: RootState) => selectOwnAccount(state);
import { AnyAction } from "redux";
import {
  Record as ImmutableRecord,
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS
} from 'immutable'
import trim from 'lodash/trim'
import * as BuildConfig from 'src/build-config';

import {
  AUTH_APP_CREATED,
  AUTH_APP_AUTHORIZED,
  AUTH_LOGGED_IN,
  AUTH_LOGGED_OUT,
  SWITCH_ACCOUNT,
  VERIFY_CREDENTIALS_FAIL,
  VERIFY_CREDENTIALS_SUCCESS
} from 'src/actions/auth'
import type { APIEntity, Account as AccountEntity } from 'src/types/entities';
import { validId, isURL } from 'src/utils/auth';
import { ME_FETCH_SKIP } from "src/actions/me";
import KVStore from "src/storage/kv-store";
import { AxiosError } from "axios";

export const AuthAppRecord = ImmutableRecord({
  access_token: null as string | null,
  client_id: null as string | null,
  client_secret: null as string | null,
  id: null as string | null,
  name: null as string | null,
  redirect_uri: null as string | null,
  token_type: null as string | null,
  vapid_key: null as string | null,
  website: null as string | null,
});

export const AuthTokenRecord = ImmutableRecord({
  access_token: '',
  account: null as string | null,
  created_at: 0,
  expires_in: null as number | null,
  id: null as number | null,
  me: null as string | null,
  refresh_token: null as string | null,
  scope: '',
  token_type: '',
});

export const AuthUserRecord = ImmutableRecord({
  access_token: '',
  id: '',
  url: '',
});

export const ReducerRecord = ImmutableRecord({
  app: AuthAppRecord(),
  tokens: ImmutableMap<string, AuthToken>(),
  users: ImmutableMap<string, AuthUser>(),
  me: null as string | null,
});

type AuthToken = ReturnType<typeof AuthTokenRecord>;
type AuthUser = ReturnType<typeof AuthUserRecord>;
type State = ReturnType<typeof ReducerRecord>;

const buildKey = (parts: string[]) => parts.join(':');

// For subdirectory support - TODO: change to apollo and understand what this is
const NAMESPACE = trim(BuildConfig.FE_SUBDIRECTORY, '/') ? `apollo@${BuildConfig.FE_SUBDIRECTORY}` : 'apollo';

const STORAGE_KEY = buildKey([NAMESPACE, 'auth']);
const SESSION_KEY = buildKey([NAMESPACE, 'auth', 'me']);

const getSessionUser = () => {
  const id = sessionStorage.getItem(SESSION_KEY);
  return validId(id) ? id : undefined;
};

const getLocalState = () => {
  const state = JSON.parse(localStorage.getItem(STORAGE_KEY)!);

  if (!state) return undefined;

  return ReducerRecord({
    app: AuthAppRecord(state.app),
    tokens: ImmutableMap(Object.entries(state.tokens).map(([key, value]) => [key, AuthTokenRecord(value as any)])),
    users: ImmutableMap(Object.entries(state.users).map(([key, value]) => [key, AuthUserRecord(value as any)])),
    me: state.me,
  });
};

const sessionUser = getSessionUser();
export const localState = getLocalState(); fromJS(JSON.parse(localStorage.getItem(STORAGE_KEY)!));

const importToken = (state: State, token: APIEntity) => {
  return state.setIn(['tokens', token.access_token], AuthTokenRecord(token));
};

// Checks if the user has an ID and access token
const validUser = (user?: AuthUser) => {
  try {
    return !!(user && validId(user.id) && validId(user.access_token));
  } catch (e) {
    return false;
  }
};

// Finds the first valid user in the state
const firstValidUser = (state: State) => state.users.find(validUser);

// For legacy purposes. IDs get upgraded to URLs further down.
const getUrlOrId = (user?: AuthUser): string | null => {
  try {
    const { id, url } = user!.toJS();
    return (url || id) as string;
  } catch {
    return null;
  }
};

// If `me` doesn't match an existing user, attempt to shift it.
const maybeShiftMe = (state: State) => {
  const me = state.me!;
  const user = state.users.get(me);

  if (!validUser(user)) {
    const nextUser = firstValidUser(state);
    return state.set('me', getUrlOrId(nextUser));
  } else {
    return state;
  }
};

// Set the user from the session or localStorage, whichever is valid first
const setSessionUser = (state: State) => state.update('me', me => {
  const user = ImmutableList<AuthUser>([
    state.users.get(sessionUser!)!,
    state.users.get(me!)!,
  ]).find(validUser);

  return getUrlOrId(user);
});

const deleteUser = (state: State, account: Pick<AccountEntity, 'url'>) => {
  const accountUrl = account.url;

  return state.withMutations(state => {
    if (accountUrl !== undefined) {
      state.update('users', users => users.delete(accountUrl));
    }

    state.update('tokens', tokens => tokens.filterNot(token => token.get('me') === accountUrl));
    maybeShiftMe(state);
  });
};

const isUpgradingUrlId = (state: State) => {
  const me = state.me;
  const user = state.users.get(me!);
  return validId(me) && user && !isURL(me);
};

// Checks the state and makes it valid
const sanitizeState = (state: State) => {
  // Skip sanitation during ID to URL upgrade
  if (isUpgradingUrlId(state)) return state;

  return state.withMutations(state => {
    // Remove invalid users, ensure ID match
    state.update('users', users => (
      users.filter((user, url) => (
        validUser(user) && user.get('url') === url
      ))
    ));
    // Remove mismatched tokens
    state.update('tokens', tokens => (
      tokens.filter((token, id) => (
        validId(id) && token.get('access_token') === id
      ))
    ));
  });
};

const persistAuth = (state: State) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state.toJS()));

const persistSession = (state: State) => {
  const me = state.me;
  if (me && typeof me === 'string') {
    sessionStorage.setItem(SESSION_KEY, me);
  }
};

const persistState = (state: State) => {
  persistAuth(state);
  persistSession(state);
};

const initialize = (state: State) => {
  return state.withMutations(state => {
    maybeShiftMe(state);
    setSessionUser(state);
    sanitizeState(state);
    persistState(state);
  });
};

const persistAuthAccount = (account: APIEntity) => {
  if (account && account.url) {
    const key = `authAccount:${account.url}`;
    if (!account.pleroma) account.pleroma = {};
    KVStore.getItem(key).then((oldAccount: any) => {
      const settings = oldAccount?.pleroma?.settings_store || {};
      if (!account.pleroma.settings_store) {
        account.pleroma.settings_store = settings;
      }
      KVStore.setItem(key, account);
    })
      .catch(console.error);
  }
};

// Returns a predicate function for filtering a mismatched user/token
const userMismatch = (token: string, account: APIEntity) => {
  return (user: AuthUser, url: string) => {
    const sameToken = user.get('access_token') === token;
    const differentUrl = url !== account.url || user.get('url') !== account.url;
    const differentId = user.get('id') !== account.id;

    return sameToken && (differentUrl || differentId);
  };
};

const importCredentials = (state: State, token: string, account: APIEntity) => {
  return state.withMutations(state => {
    state.setIn(['users', account.url], AuthUserRecord({
      id: account.id,
      access_token: token,
      url: account.url,
    }));
    state.setIn(['tokens', token, 'account'], account.id);
    state.setIn(['tokens', token, 'me'], account.url);
    state.update('users', users => users.filterNot(userMismatch(token, account)));
    state.update('me', me => me || account.url);
  });
};

const deleteToken = (state: State, token: string) => {
  return state.withMutations(state => {
    state.update('tokens', tokens => tokens.delete(token));
    state.update('users', users => users.filterNot(user => user.get('access_token') === token));
    maybeShiftMe(state);
  });
};

const deleteForbiddenToken = (state: State, error: AxiosError, token: string) => {
  if ([401, 403].includes(error.response?.status!)) {
    return deleteToken(state, token);
  } else {
    return state;
  }
};

const initialState = initialize(ReducerRecord().merge(localState as any));

const reducer = (state: State, action: AnyAction) => {
  switch (action.type) {
    case AUTH_APP_CREATED:
      return state.set('app', AuthAppRecord(action.app));
    case AUTH_APP_AUTHORIZED:
      return state.update('app', app => app.merge(action.token));
    case AUTH_LOGGED_IN:
      return importToken(state, action.token);
    case AUTH_LOGGED_OUT:
      return deleteUser(state, action.account);
    case VERIFY_CREDENTIALS_SUCCESS:
      persistAuthAccount(action.account);
      return importCredentials(state, action.token, action.account);
    case VERIFY_CREDENTIALS_FAIL:
      return deleteForbiddenToken(state, action.error, action.token);
    case SWITCH_ACCOUNT:
      return state.set('me', action.account.url);
    case ME_FETCH_SKIP:
      return state.set('me', null);
    default:
      return state;
  }
};


const reload = () => location.replace('/');

// `me` is a user ID string
const validMe = (state: State) => {
  const me = state.me;
  return typeof me === 'string';
};

const userSwitched = (oldState: State, state: State) => {
  const me = state.me;
  const oldMe = oldState.me;

  const stillValid = validMe(oldState) && validMe(state);
  const didChange = oldMe !== me;
  const userUpgradedUrl = state.users.get(me!)?.id === oldMe;

  return stillValid && didChange && !userUpgradedUrl;
};

const maybeReload = (oldState: State, state: State, action: AnyAction) => {
  const shouldRefresh = action.type === AUTH_LOGGED_OUT && action.refresh;
  const switched = userSwitched(oldState, state);

  if (switched || shouldRefresh) {
    reload();
  }
};

export default function auth(oldState: State = initialState, action: AnyAction) {
  const state = reducer(oldState, action);

  if (!state.equals(oldState)) {
    // Persist the state in localStorage
    persistAuth(state);

    // When middle-clicking a profile, we want to save the
    // user in localStorage, but not update the reducer
    if (action.background === true) {
      return oldState;
    }

    // Persist the session
    persistSession(state);

    // Reload the page under some conditions
    maybeReload(oldState, state, action);
  }

  return state;
}
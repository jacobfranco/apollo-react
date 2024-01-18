import { Record as ImmutableRecord } from 'immutable'
import { combineReducers } from 'redux-immutable'

import { AUTH_LOGGED_OUT } from 'src/actions/auth';
import * as BuildConfig from 'src/build-config';
import entities from 'src/entity-store/reducer'

import apollo from './apollo'
import auth from './auth'
import me from './me'
import settings from './settings'

const reducers = {
  apollo,
  auth,
  entities,
  me,
  settings
};

// Build a default state from all reducers: it has the key and `undefined`
export const StateRecord = ImmutableRecord(
  Object.keys(reducers).reduce((params: Record<string, any>, reducer) => {
    params[reducer] = undefined;
    return params;
  }, {}),
);

const appReducer = combineReducers(reducers, StateRecord);

// Clear the state (mostly) when the user logs out
const logOut = (state: any = StateRecord()): ReturnType<typeof appReducer> => {
  if (BuildConfig.NODE_ENV === 'production') {
    location.href = '/login';
  }

  const whitelist: string[] = ['instance', 'soapbox', 'custom_emojis', 'auth'];

  return StateRecord(
    whitelist.reduce((acc: Record<string, any>, curr) => {
      acc[curr] = state.get(curr);
      return acc;
    }, {}),
  ) as unknown as ReturnType<typeof appReducer>;
};

const rootReducer: typeof appReducer = (state, action) => {
  switch (action.type) {
    case AUTH_LOGGED_OUT:
      return appReducer(logOut(state), action);
    default:
      return appReducer(state, action);
  }
};

export default rootReducer;
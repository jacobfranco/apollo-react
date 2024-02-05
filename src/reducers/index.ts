import { Record as ImmutableRecord } from 'immutable'
import { combineReducers } from 'redux-immutable'

import { AUTH_LOGGED_OUT } from 'src/actions/auth';
import * as BuildConfig from 'src/build-config';
import entities from 'src/entity-store/reducer'

import apollo from './apollo'
import auth from './auth'
import compose from './compose'
import conversations from './conversations'
import dropdown_menu from './dropdown-menu'
import filters from './filters'
import group_memberships from './group-memberships';
import group_relationships from './group-relationships';
import groups from './groups';
import me from './me'
import notifications from './notifications'
import pending_statuses from './pending-statuses'
import polls from './polls'
import relationships from './relationships'
import search from './search'
import settings from './settings'
import sidebar from './sidebar'
import statuses from './statuses'
import suggestions from './suggestions'
import timelines from './timelines'
import trends from './trends'
import user_lists from './user_lists'

const reducers = {
  apollo,
  auth,
  compose,
  conversations,
  dropdown_menu,
  entities,
  filters,
  groups,
  group_memberships,
  group_relationships,
  me,
  notifications,
  pending_statuses,
  polls,
  relationships,
  search,
  settings,
  sidebar,
  statuses,
  suggestions,
  timelines,
  trends,
  user_lists
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
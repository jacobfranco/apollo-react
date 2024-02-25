import { Record as ImmutableRecord } from 'immutable'
import { combineReducers } from 'redux-immutable'

import { AUTH_LOGGED_OUT } from 'src/actions/auth';
import * as BuildConfig from 'src/build-config';
import entities from 'src/entity-store/reducer'

import admin_user_index from './admin-user-index'
import admin from './admin'
import apollo from './apollo'
import auth from './auth'
import compose from './compose'
import contexts from './contexts'
import conversations from './conversations'
import dropdown_menu from './dropdown-menu'
import filters from './filters'
import followed_tags from './followed-tags'
import group_memberships from './group-memberships';
import group_relationships from './group-relationships';
import groups from './groups';
import me from './me'
import meta from './meta'
import modals from './modals'
import mutes from './mutes'
import notifications from './notifications'
import onboarding from './onboarding'
import pending_statuses from './pending-statuses'
import polls from './polls'
import profile_hover_card from './profile-hover-card'
import relationships from './relationships'
import reports from './reports'
import rules from './rules'
import scheduled_statuses from './scheduled-statuses'
import search from './search'
import sidebar from './sidebar'
import status_hover_card from './status-hover-card'
import settings from './settings'
import status_lists from './status-lists'
import statuses from './statuses'
import suggestions from './suggestions'
import tags from './tags'
import timelines from './timelines'
import trends from './trends'
import user_lists from './user_lists'

const reducers = {
  admin_user_index,
  admin,
  apollo,
  auth,
  compose,
  contexts,
  conversations,
  dropdown_menu,
  entities,
  filters,
  followed_tags,
  group_memberships,
  group_relationships,
  groups,
  me,
  meta,
  modals,
  mutes,
  notifications,
  onboarding,
  pending_statuses,
  polls,
  profile_hover_card,
  relationships,
  reports,
  rules,
  scheduled_statuses,
  search,
  settings,
  sidebar,
  status_hover_card,
  status_lists,
  statuses,
  suggestions,
  tags,
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

  const whitelist: string[] = ['instance', 'apollo', 'auth']; // TODO: Change

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
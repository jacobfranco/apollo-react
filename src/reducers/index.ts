import { combineReducers } from "@reduxjs/toolkit";

import entities from "src/entity-store/reducer";

import activity from "./activity";
import admin from "./admin";
import apollo from "./apollo";
import auth from "./auth";
import chats from "./chats";
import compose from "./compose";
import contexts from "./contexts";
import conversations from "./conversations";
import dropdown_menu from "./dropdown-menu";
import filters from "./filters";
import followed_tags from "./followed-tags";
import group_memberships from "./group-memberships";
import group_relationships from "./group-relationships";
import groups from "./groups";
import matches from "./matches";
import me from "./me";
import meta from "./meta";
import modals from "./modals";
import mutes from "./mutes";
import notifications from "./notifications";
import onboarding from "./onboarding";
import pending_statuses from "./pending-statuses";
import players from "./players";
import polls from "./polls";
import profile_hover_card from "./profile-hover-card";
import relationships from "./relationships";
import reports from "./reports";
import scheduled_statuses from "./scheduled-statuses";
import search from "./search";
import security from "./security";
import series from "./series";
import sidebar from "./sidebar";
import spaces from "./spaces";
import status_hover_card from "./status-hover-card";
import settings from "./settings";
import status_lists from "./status-lists";
import statuses from "./statuses";
import suggestions from "./suggestions";
import tags from "./tags";
import teams from "./teams";
import timelines from "./timelines";
import trending_statuses from "./trending-statuses";
import trending_spaces from "./trending-spaces";
import trends from "./trends";
import user_lists from "./user-lists";

const reducers = {
  activity,
  admin,
  apollo,
  auth,
  chats,
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
  matches,
  me,
  meta,
  modals,
  mutes,
  notifications,
  onboarding,
  pending_statuses,
  players,
  polls,
  profile_hover_card,
  relationships,
  reports,
  scheduled_statuses,
  search,
  security,
  series,
  settings,
  sidebar,
  spaces,
  status_hover_card,
  status_lists,
  statuses,
  suggestions,
  tags,
  teams,
  timelines,
  trending_statuses,
  trending_spaces,
  trends,
  user_lists,
};

export default combineReducers(reducers);

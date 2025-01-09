import {
  Map as ImmutableMap,
  OrderedSet as ImmutableOrderedSet,
  Record as ImmutableRecord,
} from "immutable";
import { AnyAction } from "redux";

import {
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
  FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  FOLLOW_REQUEST_REJECT_SUCCESS,
} from "src/actions/accounts";
import {
  BLOCKS_FETCH_SUCCESS,
  BLOCKS_EXPAND_SUCCESS,
} from "src/actions/blocks";
import {
  DIRECTORY_FETCH_REQUEST,
  DIRECTORY_FETCH_SUCCESS,
  DIRECTORY_FETCH_FAIL,
  DIRECTORY_EXPAND_REQUEST,
  DIRECTORY_EXPAND_SUCCESS,
  DIRECTORY_EXPAND_FAIL,
} from "src/actions/directory";
import { FAMILIAR_FOLLOWERS_FETCH_SUCCESS } from "src/actions/familiar-followers";
import {
  GROUP_MEMBERSHIP_REQUESTS_FETCH_SUCCESS,
  GROUP_MEMBERSHIP_REQUESTS_EXPAND_SUCCESS,
  GROUP_MEMBERSHIP_REQUESTS_FETCH_REQUEST,
  GROUP_MEMBERSHIP_REQUESTS_EXPAND_REQUEST,
  GROUP_MEMBERSHIP_REQUESTS_FETCH_FAIL,
  GROUP_MEMBERSHIP_REQUESTS_EXPAND_FAIL,
  GROUP_MEMBERSHIP_REQUEST_AUTHORIZE_SUCCESS,
  GROUP_MEMBERSHIP_REQUEST_REJECT_SUCCESS,
  GROUP_BLOCKS_FETCH_REQUEST,
  GROUP_BLOCKS_FETCH_SUCCESS,
  GROUP_BLOCKS_FETCH_FAIL,
  GROUP_BLOCKS_EXPAND_REQUEST,
  GROUP_BLOCKS_EXPAND_SUCCESS,
  GROUP_BLOCKS_EXPAND_FAIL,
  GROUP_UNBLOCK_SUCCESS,
} from "src/actions/groups";
import {
  REPOSTS_FETCH_SUCCESS,
  REPOSTS_EXPAND_SUCCESS,
  LIKES_FETCH_SUCCESS,
  LIKES_EXPAND_SUCCESS,
} from "src/actions/interactions";
import { NOTIFICATIONS_UPDATE } from "src/actions/notifications";

import type { APIEntity } from "src/types/entities";

export const ListRecord = ImmutableRecord({
  next: null as string | null,
  items: ImmutableOrderedSet<string>(),
  isLoading: false,
});

export const ParticipationRequestRecord = ImmutableRecord({
  account: "",
  participation_message: null as string | null,
});

const ParticipationRequestListRecord = ImmutableRecord({
  next: null as string | null,
  items: ImmutableOrderedSet<ParticipationRequest>(),
  isLoading: false,
});

export const ReducerRecord = ImmutableRecord({
  followers: ImmutableMap<string, List>(),
  following: ImmutableMap<string, List>(),
  reposted_by: ImmutableMap<string, List>(),
  liked_by: ImmutableMap<string, List>(),
  follow_requests: ListRecord(),
  blocks: ListRecord(),
  mutes: ListRecord(),
  directory: ListRecord({ isLoading: true }),
  pinned: ImmutableMap<string, List>(),
  familiar_followers: ImmutableMap<string, List>(),
  membership_requests: ImmutableMap<string, List>(),
  group_blocks: ImmutableMap<string, List>(),
});

type State = ReturnType<typeof ReducerRecord>;
export type List = ReturnType<typeof ListRecord>;
type ParticipationRequest = ReturnType<typeof ParticipationRequestRecord>;
type ParticipationRequestList = ReturnType<
  typeof ParticipationRequestListRecord
>;
type Items = ImmutableOrderedSet<string>;
type NestedListPath = [
  (
    | "followers"
    | "following"
    | "reposted_by"
    | "liked_by"
    | "pinned"
    | "familiar_followers"
    | "membership_requests"
    | "group_blocks"
  ),
  string
];
type ListPath = ["follow_requests" | "blocks" | "mutes" | "directory"];

const normalizeList = (
  state: State,
  path: NestedListPath | ListPath,
  accounts: APIEntity[],
  next?: string | null
) => {
  return state.setIn(
    path,
    ListRecord({
      next,
      items: ImmutableOrderedSet(accounts.map((item) => item.id)),
    })
  );
};

const appendToList = (
  state: State,
  path: NestedListPath | ListPath,
  accounts: APIEntity[],
  next: string | null
) => {
  return state.updateIn(path, (map) => {
    return (map as List)
      .set("next", next)
      .set("isLoading", false)
      .update("items", (list) =>
        (list as Items).concat(accounts.map((item) => item.id))
      );
  });
};

const removeFromList = (
  state: State,
  path: NestedListPath | ListPath,
  accountId: string
) => {
  return state.updateIn(path, (map) => {
    return (map as List).update("items", (list) =>
      (list as Items).filterNot((item) => item === accountId)
    );
  });
};

const normalizeFollowRequest = (state: State, notification: APIEntity) => {
  return state.updateIn(["follow_requests", "items"], (list) => {
    return ImmutableOrderedSet([notification.account.id]).union(list as Items);
  });
};

export default function userLists(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case FOLLOWERS_FETCH_SUCCESS:
      return normalizeList(
        state,
        ["followers", action.id],
        action.accounts,
        action.next
      );
    case FOLLOWERS_EXPAND_SUCCESS:
      return appendToList(
        state,
        ["followers", action.id],
        action.accounts,
        action.next
      );
    case FOLLOWING_FETCH_SUCCESS:
      return normalizeList(
        state,
        ["following", action.id],
        action.accounts,
        action.next
      );
    case FOLLOWING_EXPAND_SUCCESS:
      return appendToList(
        state,
        ["following", action.id],
        action.accounts,
        action.next
      );
    case REPOSTS_FETCH_SUCCESS:
      return normalizeList(
        state,
        ["reposted_by", action.id],
        action.accounts,
        action.next
      );
    case REPOSTS_EXPAND_SUCCESS:
      return appendToList(
        state,
        ["reposted_by", action.id],
        action.accounts,
        action.next
      );
    case LIKES_FETCH_SUCCESS:
      return normalizeList(
        state,
        ["liked_by", action.id],
        action.accounts,
        action.next
      );
    case LIKES_EXPAND_SUCCESS:
      return appendToList(
        state,
        ["liked_by", action.id],
        action.accounts,
        action.next
      );
    case NOTIFICATIONS_UPDATE:
      return action.notification.type === "follow_request"
        ? normalizeFollowRequest(state, action.notification)
        : state;
    case FOLLOW_REQUESTS_FETCH_SUCCESS:
      return normalizeList(
        state,
        ["follow_requests"],
        action.accounts,
        action.next
      );
    case FOLLOW_REQUESTS_EXPAND_SUCCESS:
      return appendToList(
        state,
        ["follow_requests"],
        action.accounts,
        action.next
      );
    case FOLLOW_REQUEST_AUTHORIZE_SUCCESS:
    case FOLLOW_REQUEST_REJECT_SUCCESS:
      return removeFromList(state, ["follow_requests"], action.id);
    case BLOCKS_FETCH_SUCCESS:
      return normalizeList(state, ["blocks"], action.accounts, action.next);
    case BLOCKS_EXPAND_SUCCESS:
      return appendToList(state, ["blocks"], action.accounts, action.next);
    case DIRECTORY_FETCH_SUCCESS:
      return normalizeList(state, ["directory"], action.accounts, action.next);
    case DIRECTORY_EXPAND_SUCCESS:
      return appendToList(state, ["directory"], action.accounts, action.next);
    case DIRECTORY_FETCH_REQUEST:
    case DIRECTORY_EXPAND_REQUEST:
      return state.setIn(["directory", "isLoading"], true);
    case DIRECTORY_FETCH_FAIL:
    case DIRECTORY_EXPAND_FAIL:
      return state.setIn(["directory", "isLoading"], false);
    case FAMILIAR_FOLLOWERS_FETCH_SUCCESS:
      return normalizeList(
        state,
        ["familiar_followers", action.id],
        action.accounts,
        action.next
      );
    case GROUP_MEMBERSHIP_REQUESTS_FETCH_SUCCESS:
      return normalizeList(
        state,
        ["membership_requests", action.id],
        action.accounts,
        action.next
      );
    case GROUP_MEMBERSHIP_REQUESTS_EXPAND_SUCCESS:
      return appendToList(
        state,
        ["membership_requests", action.id],
        action.accounts,
        action.next
      );
    case GROUP_MEMBERSHIP_REQUESTS_FETCH_REQUEST:
    case GROUP_MEMBERSHIP_REQUESTS_EXPAND_REQUEST:
      return state.setIn(["membership_requests", action.id, "isLoading"], true);
    case GROUP_MEMBERSHIP_REQUESTS_FETCH_FAIL:
    case GROUP_MEMBERSHIP_REQUESTS_EXPAND_FAIL:
      return state.setIn(
        ["membership_requests", action.id, "isLoading"],
        false
      );
    case GROUP_MEMBERSHIP_REQUEST_AUTHORIZE_SUCCESS:
    case GROUP_MEMBERSHIP_REQUEST_REJECT_SUCCESS:
      return state.updateIn(
        ["membership_requests", action.groupId, "items"],
        (list) =>
          (list as ImmutableOrderedSet<string>).filterNot(
            (item) => item === action.accountId
          )
      );
    case GROUP_BLOCKS_FETCH_SUCCESS:
      return normalizeList(
        state,
        ["group_blocks", action.id],
        action.accounts,
        action.next
      );
    case GROUP_BLOCKS_EXPAND_SUCCESS:
      return appendToList(
        state,
        ["group_blocks", action.id],
        action.accounts,
        action.next
      );
    case GROUP_BLOCKS_FETCH_REQUEST:
    case GROUP_BLOCKS_EXPAND_REQUEST:
      return state.setIn(["group_blocks", action.id, "isLoading"], true);
    case GROUP_BLOCKS_FETCH_FAIL:
    case GROUP_BLOCKS_EXPAND_FAIL:
      return state.setIn(["group_blocks", action.id, "isLoading"], false);
    case GROUP_UNBLOCK_SUCCESS:
      return state.updateIn(["group_blocks", action.groupId, "items"], (list) =>
        (list as ImmutableOrderedSet<string>).filterNot(
          (item) => item === action.accountId
        )
      );
    default:
      return state;
  }
}

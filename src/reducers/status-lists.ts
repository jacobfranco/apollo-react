import {
    Map as ImmutableMap,
    OrderedSet as ImmutableOrderedSet,
    Record as ImmutableRecord,
  } from 'immutable';
  
  import {
    STATUS_QUOTES_EXPAND_FAIL,
    STATUS_QUOTES_EXPAND_REQUEST,
    STATUS_QUOTES_EXPAND_SUCCESS,
    STATUS_QUOTES_FETCH_FAIL,
    STATUS_QUOTES_FETCH_REQUEST,
    STATUS_QUOTES_FETCH_SUCCESS,
  } from 'src/actions/status-quotes';
  import { STATUS_CREATE_SUCCESS } from 'src/actions/statuses';
  
  import {
    BOOKMARKED_STATUSES_FETCH_REQUEST,
    BOOKMARKED_STATUSES_FETCH_SUCCESS,
    BOOKMARKED_STATUSES_FETCH_FAIL,
    BOOKMARKED_STATUSES_EXPAND_REQUEST,
    BOOKMARKED_STATUSES_EXPAND_SUCCESS,
    BOOKMARKED_STATUSES_EXPAND_FAIL,
  } from 'src/actions/bookmarks';
  import {
    LIKED_STATUSES_FETCH_REQUEST,
    LIKED_STATUSES_FETCH_SUCCESS,
    LIKED_STATUSES_FETCH_FAIL,
    LIKED_STATUSES_EXPAND_REQUEST,
    LIKED_STATUSES_EXPAND_SUCCESS,
    LIKED_STATUSES_EXPAND_FAIL,
    ACCOUNT_LIKED_STATUSES_FETCH_REQUEST,
    ACCOUNT_LIKED_STATUSES_FETCH_SUCCESS,
    ACCOUNT_LIKED_STATUSES_FETCH_FAIL,
    ACCOUNT_LIKED_STATUSES_EXPAND_REQUEST,
    ACCOUNT_LIKED_STATUSES_EXPAND_SUCCESS,
    ACCOUNT_LIKED_STATUSES_EXPAND_FAIL,
  } from 'src/actions/likes';
  import {
    LIKE_SUCCESS,
    UNLIKE_SUCCESS,
    BOOKMARK_SUCCESS,
    UNBOOKMARK_SUCCESS,
    PIN_SUCCESS,
    UNPIN_SUCCESS,
  } from 'src/actions/interactions';
  import {
    PINNED_STATUSES_FETCH_SUCCESS,
  } from 'src/actions/pin-statuses';
  import {
    SCHEDULED_STATUSES_FETCH_REQUEST,
    SCHEDULED_STATUSES_FETCH_SUCCESS,
    SCHEDULED_STATUSES_FETCH_FAIL,
    SCHEDULED_STATUSES_EXPAND_REQUEST,
    SCHEDULED_STATUSES_EXPAND_SUCCESS,
    SCHEDULED_STATUSES_EXPAND_FAIL,
    SCHEDULED_STATUS_CANCEL_REQUEST,
    SCHEDULED_STATUS_CANCEL_SUCCESS,
  } from 'src/actions/scheduled-statuses';
  
  import type { AnyAction } from 'redux';
  import type { APIEntity } from 'src/types/entities';
  
  export const StatusListRecord = ImmutableRecord({
    next: null as string | null,
    loaded: false,
    isLoading: null as boolean | null,
    items: ImmutableOrderedSet<string>(),
  });
  
  type State = ImmutableMap<string, StatusList>;
  type StatusList = ReturnType<typeof StatusListRecord>;
  
  const initialState: State = ImmutableMap({
    likes: StatusListRecord(),
    bookmarks: StatusListRecord(),
    pins: StatusListRecord(),
    scheduled_statuses: StatusListRecord(),
  });
  
  const getStatusId = (status: string | APIEntity) => typeof status === 'string' ? status : status.id;
  
  const getStatusIds = (statuses: APIEntity[] = []) => (
    ImmutableOrderedSet(statuses.map(getStatusId))
  );
  
  const setLoading = (state: State, listType: string, loading: boolean) => state.setIn([listType, 'isLoading'], loading);
  
  const normalizeList = (state: State, listType: string, statuses: APIEntity[], next: string | null) => {
    return state.update(listType, StatusListRecord(), listMap => listMap.withMutations(map => {
      map.set('next', next);
      map.set('loaded', true);
      map.set('isLoading', false);
      map.set('items', getStatusIds(statuses));
    }));
  };
  
  const appendToList = (state: State, listType: string, statuses: APIEntity[], next: string | null) => {
    const newIds = getStatusIds(statuses);
  
    return state.update(listType, StatusListRecord(), listMap => listMap.withMutations(map => {
      map.set('next', next);
      map.set('isLoading', false);
      map.update('items', items => items.union(newIds));
    }));
  };
  
  const prependOneToList = (state: State, listType: string, status: APIEntity) => {
    const statusId = getStatusId(status);
    return state.updateIn([listType, 'items'], ImmutableOrderedSet(), items => {
      return ImmutableOrderedSet([statusId]).union(items as ImmutableOrderedSet<string>);
    });
  };
  
  const removeOneFromList = (state: State, listType: string, status: APIEntity) => {
    const statusId = getStatusId(status);
    return state.updateIn([listType, 'items'], ImmutableOrderedSet(), items => (items as ImmutableOrderedSet<string>).delete(statusId));
  };
  
  const maybeAppendScheduledStatus = (state: State, status: APIEntity) => {
    if (!status.scheduled_at) return state;
    return prependOneToList(state, 'scheduled_statuses', getStatusId(status));
  };
  
  export default function statusLists(state = initialState, action: AnyAction) {
    switch (action.type) {
      case LIKED_STATUSES_FETCH_REQUEST:
      case LIKED_STATUSES_EXPAND_REQUEST:
        return setLoading(state, 'likes', true);
      case LIKED_STATUSES_FETCH_FAIL:
      case LIKED_STATUSES_EXPAND_FAIL:
        return setLoading(state, 'likes', false);
      case LIKED_STATUSES_FETCH_SUCCESS:
        return normalizeList(state, 'likes', action.statuses, action.next);
      case LIKED_STATUSES_EXPAND_SUCCESS:
        return appendToList(state, 'likes', action.statuses, action.next);
      case ACCOUNT_LIKED_STATUSES_FETCH_REQUEST:
      case ACCOUNT_LIKED_STATUSES_EXPAND_REQUEST:
        return setLoading(state, `likes:${action.accountId}`, true);
      case ACCOUNT_LIKED_STATUSES_FETCH_FAIL:
      case ACCOUNT_LIKED_STATUSES_EXPAND_FAIL:
        return setLoading(state, `likes:${action.accountId}`, false);
      case ACCOUNT_LIKED_STATUSES_FETCH_SUCCESS:
        return normalizeList(state, `likes:${action.accountId}`, action.statuses, action.next);
      case ACCOUNT_LIKED_STATUSES_EXPAND_SUCCESS:
        return appendToList(state, `likes:${action.accountId}`, action.statuses, action.next);
      case BOOKMARKED_STATUSES_FETCH_REQUEST:
      case BOOKMARKED_STATUSES_EXPAND_REQUEST:
        return setLoading(state, 'bookmarks', true);
      case BOOKMARKED_STATUSES_FETCH_FAIL:
      case BOOKMARKED_STATUSES_EXPAND_FAIL:
        return setLoading(state, 'bookmarks', false);
      case BOOKMARKED_STATUSES_FETCH_SUCCESS:
        return normalizeList(state, 'bookmarks', action.statuses, action.next);
      case BOOKMARKED_STATUSES_EXPAND_SUCCESS:
        return appendToList(state, 'bookmarks', action.statuses, action.next);
      case LIKE_SUCCESS:
        return prependOneToList(state, 'likes', action.status);
      case UNLIKE_SUCCESS:
        return removeOneFromList(state, 'likes', action.status);
      case BOOKMARK_SUCCESS:
        return prependOneToList(state, 'bookmarks', action.status);
      case UNBOOKMARK_SUCCESS:
        return removeOneFromList(state, 'bookmarks', action.status);
      case PINNED_STATUSES_FETCH_SUCCESS:
        return normalizeList(state, 'pins', action.statuses, action.next);
      case PIN_SUCCESS:
        return prependOneToList(state, 'pins', action.status);
      case UNPIN_SUCCESS:
        return removeOneFromList(state, 'pins', action.status);
      case SCHEDULED_STATUSES_FETCH_REQUEST:
      case SCHEDULED_STATUSES_EXPAND_REQUEST:
        return setLoading(state, 'scheduled_statuses', true);
      case SCHEDULED_STATUSES_FETCH_FAIL:
      case SCHEDULED_STATUSES_EXPAND_FAIL:
        return setLoading(state, 'scheduled_statuses', false);
      case SCHEDULED_STATUSES_FETCH_SUCCESS:
        return normalizeList(state, 'scheduled_statuses', action.statuses, action.next);
      case SCHEDULED_STATUSES_EXPAND_SUCCESS:
        return appendToList(state, 'scheduled_statuses', action.statuses, action.next);
      case SCHEDULED_STATUS_CANCEL_REQUEST:
      case SCHEDULED_STATUS_CANCEL_SUCCESS:
        return removeOneFromList(state, 'scheduled_statuses', action.id || action.status.id);
      case STATUS_QUOTES_FETCH_REQUEST:
      case STATUS_QUOTES_EXPAND_REQUEST:
        return setLoading(state, `quotes:${action.statusId}`, true);
      case STATUS_QUOTES_FETCH_FAIL:
      case STATUS_QUOTES_EXPAND_FAIL:
        return setLoading(state, `quotes:${action.statusId}`, false);
      case STATUS_QUOTES_FETCH_SUCCESS:
        return normalizeList(state, `quotes:${action.statusId}`, action.statuses, action.next);
      case STATUS_QUOTES_EXPAND_SUCCESS:
        return appendToList(state, `quotes:${action.statusId}`, action.statuses, action.next);
      case STATUS_CREATE_SUCCESS:
        return maybeAppendScheduledStatus(state, action.status);
      default:
        return state;
    }
  }
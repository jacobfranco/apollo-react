import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import {
  FOLLOWED_SPACES_FETCH_REQUEST,
  FOLLOWED_SPACES_FETCH_SUCCESS,
  FOLLOWED_SPACES_FETCH_FAIL,
  FOLLOWED_SPACES_EXPAND_REQUEST,
  FOLLOWED_SPACES_EXPAND_SUCCESS,
  FOLLOWED_SPACES_EXPAND_FAIL,
} from 'src/actions/spaces';
import { normalizeSpace } from 'src/normalizers';

import type { AnyAction } from 'redux';
import type { APIEntity, Space } from 'src/types/entities';

const ReducerRecord = ImmutableRecord({
  items: ImmutableList<Space>(),
  isLoading: false,
  next: null,
});

export default function followed_spaces(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case FOLLOWED_SPACES_FETCH_REQUEST:
      return state.set('isLoading', true);
    case FOLLOWED_SPACES_FETCH_SUCCESS:
      return state.withMutations(map => {
        map.set('items', ImmutableList(action.followed_spaces.map((item: APIEntity) => normalizeSpace(item))));
        map.set('isLoading', false);
        map.set('next', action.next);
      });
    case FOLLOWED_SPACES_FETCH_FAIL:
      return state.set('isLoading', false);
    case FOLLOWED_SPACES_EXPAND_REQUEST:
      return state.set('isLoading', true);
    case FOLLOWED_SPACES_EXPAND_SUCCESS:
      return state.withMutations(map => {
        map.update('items', list => list.concat(action.followed_spaces.map((item: APIEntity) => normalizeSpace(item))));
        map.set('isLoading', false);
        map.set('next', action.next);
      });
    case FOLLOWED_SPACES_EXPAND_FAIL:
      return state.set('isLoading', false);
    default:
      return state;
  }
}
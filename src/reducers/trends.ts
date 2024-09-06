import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import { normalizeTag, normalizeSpace } from 'src/normalizers';

import {
  TRENDS_FETCH_REQUEST,
  TRENDS_FETCH_SUCCESS,
  TRENDS_FETCH_FAIL,
  TRENDING_SPACES_FETCH_REQUEST,
  TRENDING_SPACES_FETCH_SUCCESS,
  TRENDING_SPACES_FETCH_FAIL
} from 'src/actions/trends';

import type { AnyAction } from 'redux';
import type { APIEntity, Space, Tag } from 'src/types/entities';

// TODO: Look back over this and finish this life
const ReducerRecord = ImmutableRecord({
  items: ImmutableList<Tag>(),
  isLoading: false,
});

type State = ReturnType<typeof ReducerRecord>;

export default function trendsReducer(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case TRENDS_FETCH_REQUEST:
      return state.set('isLoading', true);
    case TRENDS_FETCH_SUCCESS:
      return state.withMutations(map => {
        map.set('items', ImmutableList(action.tags.map((item: APIEntity) => normalizeTag(item))));
        map.set('isLoading', false);
      });
    case TRENDS_FETCH_FAIL:
      return state.set('isLoading', false);
    default:
      return state;
  }
}
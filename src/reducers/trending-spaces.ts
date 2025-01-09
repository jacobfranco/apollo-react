import { List as ImmutableList, Record as ImmutableRecord } from "immutable";

import { normalizeSpace } from "src/normalizers";

import {
  TRENDING_SPACES_FETCH_REQUEST,
  TRENDING_SPACES_FETCH_SUCCESS,
  TRENDING_SPACES_FETCH_FAIL,
} from "src/actions/trends";

import type { AnyAction } from "redux";
import type { APIEntity, Space } from "src/types/entities";

const ReducerRecord = ImmutableRecord({
  items: ImmutableList<Space>(),
  isLoading: false,
});

type State = ReturnType<typeof ReducerRecord>;

export default function trendsReducer(
  state: State = ReducerRecord(),
  action: AnyAction
) {
  switch (action.type) {
    case TRENDING_SPACES_FETCH_REQUEST:
      return state.set("isLoading", true);
    case TRENDING_SPACES_FETCH_SUCCESS:
      return state.withMutations((map) => {
        map.set(
          "items",
          ImmutableList(
            action.spaces.map((item: APIEntity) => normalizeSpace(item))
          )
        );
        map.set("isLoading", false);
      });
    case TRENDING_SPACES_FETCH_FAIL:
      return state.set("isLoading", false);
    default:
      return state;
  }
}

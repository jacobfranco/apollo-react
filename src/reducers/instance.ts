import { Map as ImmutableMap } from "immutable";
import {
  INSTANCE_STATS_REQUEST,
  INSTANCE_STATS_SUCCESS,
  INSTANCE_STATS_FAIL,
} from "../actions/instance";

import type { AnyAction } from "redux";

interface InstanceState {
  userCount?: number;
  statusCount?: number;
  mau?: number;
  isLoading: boolean;
  error: Error | null;
}

type State = ImmutableMap<string, any>;

const initialState: State = ImmutableMap({
  userCount: undefined,
  statusCount: undefined,
  mau: undefined,
  isLoading: false,
  error: null,
});

export default function instance(
  state: State = initialState,
  action: AnyAction
): State {
  switch (action.type) {
    case INSTANCE_STATS_REQUEST:
      return state.merge({
        isLoading: true,
        error: null,
      });

    case INSTANCE_STATS_SUCCESS:
      return state.merge({
        ...action.stats,
        isLoading: false,
        error: null,
      });

    case INSTANCE_STATS_FAIL:
      return state.merge({
        isLoading: false,
        error: action.error,
      });

    default:
      return state;
  }
}

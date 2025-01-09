import {
  SPACE_FETCH_SUCCESS,
  SPACE_FOLLOW_REQUEST,
  SPACE_FOLLOW_FAIL,
  SPACE_UNFOLLOW_REQUEST,
  SPACE_UNFOLLOW_FAIL,
  ALL_SPACES_FETCH_SUCCESS,
  SPACE_FOLLOW_SUCCESS,
  SPACE_UNFOLLOW_SUCCESS,
} from "src/actions/spaces";
import { normalizeSpace } from "src/normalizers";
import { Map as ImmutableMap } from "immutable";

import type { AnyAction } from "redux";
import type { Space } from "src/types/entities";

const initialState = ImmutableMap<string, Space>();

export default function spaces(state = initialState, action: AnyAction) {
  switch (action.type) {
    // handle single fetch success
    case SPACE_FETCH_SUCCESS: {
      const normalized = normalizeSpace(action.space);
      // Use action.id or action.name, whichever you actually dispatch.
      return state.set(action.id, normalized);
    }

    // handle bulk fetch success
    case ALL_SPACES_FETCH_SUCCESS: {
      const { spaces } = action;
      console.log("Handling spaces in reducer:", spaces);
      let newState = state;
      spaces.forEach((s: Record<string, any>) => {
        const normalized = normalizeSpace(s);
        newState = newState.set(normalized.id, normalized);
      });
      return newState;
    }

    case SPACE_FOLLOW_REQUEST:
    case SPACE_UNFOLLOW_FAIL:
      return state.setIn([action.id, "following"], true);

    case SPACE_FOLLOW_FAIL:
    case SPACE_UNFOLLOW_REQUEST:
      return state.setIn([action.id, "following"], false);
    case SPACE_FOLLOW_SUCCESS: {
      const normalized = normalizeSpace(action.space);
      return state.setIn([normalized.id, "following"], true);
    }
    case SPACE_UNFOLLOW_SUCCESS: {
      const normalized = normalizeSpace(action.space);
      return state.setIn([normalized.id, "following"], false);
    }

    default:
      return state;
  }
}

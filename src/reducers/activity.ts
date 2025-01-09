import { AnyAction } from "@reduxjs/toolkit";
import { Map as ImmutableMap, Record as ImmutableRecord } from "immutable";

const ReducerRecord = ImmutableRecord({
  lastActivity: ImmutableMap<string, string>(), // userId -> timestamp
});

type State = ReturnType<typeof ReducerRecord>;

const TRACK_USER_ACTIVITY = "TRACK_USER_ACTIVITY";

export default function activityReducer(
  state: State = ReducerRecord(),
  action: AnyAction
): State {
  switch (action.type) {
    case TRACK_USER_ACTIVITY: {
      const { userId, timestamp } = action.payload;
      return state.setIn(["lastActivity", userId], timestamp);
    }
    default:
      return state;
  }
}

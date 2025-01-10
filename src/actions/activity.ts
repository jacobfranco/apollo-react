import api from "../api/index";
import type { AppDispatch, RootState } from "src/store";
import type { APIEntity } from "src/types/entities";

// Action Types
export const TRACK_USER_ACTIVITY_REQUEST = "TRACK_USER_ACTIVITY_REQUEST";
export const TRACK_USER_ACTIVITY_SUCCESS = "TRACK_USER_ACTIVITY_SUCCESS";
export const TRACK_USER_ACTIVITY_FAIL = "TRACK_USER_ACTIVITY_FAIL";

// Action Creators
const trackActivityRequest = () => ({
  type: TRACK_USER_ACTIVITY_REQUEST,
});

const trackActivitySuccess = (data: APIEntity) => ({
  type: TRACK_USER_ACTIVITY_SUCCESS,
  payload: data,
});

const trackActivityFail = (error: unknown) => ({
  type: TRACK_USER_ACTIVITY_FAIL,
  error,
});

// Thunk Action Creator
export const trackUserActivity =
  (userId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const timestamp = new Date().toISOString();

    dispatch(trackActivityRequest());

    api(getState)
      .post("/api/admin/track-activity", {
        userId,
        timestamp,
      })
      .then((response) => response.json())
      .then((data) => {
        dispatch(trackActivitySuccess(data));
      })
      .catch((error) => {
        console.error("Failed to track activity:", error);
        dispatch(trackActivityFail(error));
      });
  };

export { trackActivityRequest, trackActivitySuccess, trackActivityFail };

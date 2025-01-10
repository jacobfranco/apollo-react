import api from "../api/index";
import type { AppDispatch, RootState } from "src/store";
import type { ApolloResponse } from "src/api/ApolloResponse";

// Action Types
export const INSTANCE_STATS_REQUEST = "INSTANCE_STATS_REQUEST";
export const INSTANCE_STATS_SUCCESS = "INSTANCE_STATS_SUCCESS";
export const INSTANCE_STATS_FAIL = "INSTANCE_STATS_FAIL";

interface InstanceStats {
  userCount: number;
  statusCount: number;
  mau: number;
}

// Action Creators
const fetchInstanceStatsRequest = () => ({
  type: INSTANCE_STATS_REQUEST,
});

const fetchInstanceStatsSuccess = (stats: InstanceStats) => ({
  type: INSTANCE_STATS_SUCCESS,
  stats,
});

const fetchInstanceStatsFail = (error: unknown) => ({
  type: INSTANCE_STATS_FAIL,
  error,
});

// Thunk Action
export const fetchInstanceStats =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchInstanceStatsRequest());

    api(getState)
      .get("/api/admin/instance")
      .then((response) => response.json())
      .then((data: ApolloResponse & InstanceStats) => {
        dispatch(
          fetchInstanceStatsSuccess({
            userCount: data.userCount,
            statusCount: data.statusCount,
            mau: data.mau,
          })
        );
      })
      .catch((error) => dispatch(fetchInstanceStatsFail(error)));
  };

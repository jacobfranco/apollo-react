import api from "../api/index";
import type { AppDispatch, RootState } from "src/store";
import type { ApolloResponse } from "src/api/ApolloResponse";

// Action Types
export const INSTANCE_STATS_REQUEST = "INSTANCE_STATS_REQUEST";
export const INSTANCE_STATS_SUCCESS = "INSTANCE_STATS_SUCCESS";
export const INSTANCE_STATS_FAIL = "INSTANCE_STATS_FAIL";
export const INSTANCE_METRICS_REQUEST = "INSTANCE_METRICS_REQUEST";
export const INSTANCE_METRICS_SUCCESS = "INSTANCE_METRICS_SUCCESS";
export const INSTANCE_METRICS_FAIL = "INSTANCE_METRICS_FAIL";

interface InstanceStats {
  userCount: number;
  statusCount: number;
  mau: number;
}

interface Metrics {
  requests: number;
  uniqueIPs: number;
}

interface InstanceMetrics {
  hourly: Record<string, Metrics>;
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

const fetchInstanceMetricsRequest = () => ({
  type: INSTANCE_METRICS_REQUEST,
});

const fetchInstanceMetricsSuccess = (metrics: InstanceMetrics) => ({
  type: INSTANCE_METRICS_SUCCESS,
  metrics,
});

const fetchInstanceMetricsFail = (error: unknown) => ({
  type: INSTANCE_METRICS_FAIL,
  error,
});

// Thunk Actions
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

export const fetchInstanceMetrics =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchInstanceMetricsRequest());
    api(getState)
      .get("/api/metrics")
      .then((response) => response.json())
      .then((data) => {
        console.log("Raw metrics response:", data);
        console.log("Response hourly property:", data.hourly);
        console.log("First hourly entry:", Object.entries(data.hourly)[0]);
        dispatch(fetchInstanceMetricsSuccess(data));
      })
      .catch((error) => {
        console.error("Metrics fetch error:", error);
        dispatch(fetchInstanceMetricsFail(error));
      });
  };

import { Map as ImmutableMap } from "immutable";
import { AnyAction } from "redux";
import {
  INSTANCE_STATS_REQUEST,
  INSTANCE_METRICS_REQUEST,
  INSTANCE_STATS_SUCCESS,
  INSTANCE_METRICS_SUCCESS,
  INSTANCE_STATS_FAIL,
  INSTANCE_METRICS_FAIL,
} from "src/actions/instance";

interface InstanceState {
  userCount?: number;
  statusCount?: number;
  mau?: number;
  metrics?: {
    requests: number;
    uniqueIPs: number;
  };
  isLoading: boolean;
  error: Error | null;
}

type State = ImmutableMap<string, any>;

const initialState: State = ImmutableMap({
  userCount: undefined,
  statusCount: undefined,
  mau: undefined,
  metrics: undefined,
  isLoading: false,
  error: null,
});

export default function instance(
  state: State = initialState,
  action: AnyAction
): State {
  switch (action.type) {
    case INSTANCE_STATS_REQUEST:
    case INSTANCE_METRICS_REQUEST:
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
    case INSTANCE_METRICS_SUCCESS:
      console.log("Reducer received metrics:", action.metrics);
      console.log("Reducer hourly data:", action.metrics.hourly);

      const metricsEntries = Object.entries(action.metrics.hourly);
      console.log("Metrics entries:", metricsEntries);

      const latestMetrics =
        metricsEntries.length > 0
          ? metricsEntries[0][1]
          : { requests: 0, uniqueIPs: 0 };
      console.log("Selected metrics:", latestMetrics);

      return state.merge({
        metrics: latestMetrics,
        isLoading: false,
        error: null,
      });

    case INSTANCE_STATS_FAIL:
    case INSTANCE_METRICS_FAIL:
      return state.merge({
        isLoading: false,
        error: action.error,
      });
    default:
      return state;
  }
}

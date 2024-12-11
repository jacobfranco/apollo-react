// reducers/series.ts

import { Record, Map as ImmutableMap } from "immutable";
import { Series } from "src/schemas/series";
import {
  FETCH_SERIES_REQUEST,
  FETCH_SERIES_SUCCESS,
  FETCH_SERIES_FAILURE,
  UPDATE_SERIES,
  FETCH_SERIES_BY_ID_REQUEST,
  FETCH_SERIES_BY_ID_SUCCESS,
  FETCH_SERIES_BY_ID_FAILURE,
} from "src/actions/series";

interface SeriesStateProps {
  seriesByWeek: ImmutableMap<number, Series>; // For week-based series data
  seriesById: ImmutableMap<number, Series>; // For individual series data
  fetchedSeriesIds: ImmutableMap<number, boolean>;
  loading: boolean;
  error: string | null;
}

const SeriesStateRecord = Record<SeriesStateProps>({
  seriesByWeek: ImmutableMap<number, Series>(),
  seriesById: ImmutableMap<number, Series>(),
  fetchedSeriesIds: ImmutableMap(),
  loading: false,
  error: null,
});

type SeriesState = Record<SeriesStateProps> & Readonly<SeriesStateProps>;

const initialState: SeriesState = new SeriesStateRecord();

export default function seriesReducer(
  state: SeriesState = initialState,
  action: any
): SeriesState {
  switch (action.type) {
    case FETCH_SERIES_REQUEST:
    case FETCH_SERIES_BY_ID_REQUEST: {
      const seriesId = action.payload;
      return state.merge({
        loading: true,
        error: null,
        fetchedSeriesIds: state.get("fetchedSeriesIds").set(seriesId, true),
      }) as SeriesState;
    }

    case FETCH_SERIES_SUCCESS: {
      const seriesArray = action.payload as Series[];
      let seriesByWeek = ImmutableMap<number, Series>(); // Reset seriesByWeek for new week data
      seriesArray.forEach((series) => {
        seriesByWeek = seriesByWeek.set(series.id, series);
      });
      return state.merge({
        seriesByWeek,
        loading: false,
      }) as SeriesState;
    }

    case FETCH_SERIES_BY_ID_SUCCESS: {
      const series = action.payload as Series;
      const seriesById = state.get("seriesById").set(series.id, series);
      return state.merge({
        seriesById,
        loading: false,
      }) as SeriesState;
    }

    case FETCH_SERIES_FAILURE:
    case FETCH_SERIES_BY_ID_FAILURE:
      return state.merge({
        loading: false,
        error: action.payload,
      }) as SeriesState;

    case UPDATE_SERIES: {
      const updatedSeries = action.payload as Series;
      const seriesById = state
        .get("seriesById")
        .set(updatedSeries.id, updatedSeries);
      return state.set("seriesById", seriesById) as SeriesState;
    }

    default:
      return state;
  }
}

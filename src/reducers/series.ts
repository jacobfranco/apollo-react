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
  seriesById: ImmutableMap<number, Series>;
  loading: boolean;
  error: string | null;
}

const SeriesStateRecord = Record<SeriesStateProps>({
  seriesById: ImmutableMap<number, Series>(),
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
    case FETCH_SERIES_BY_ID_REQUEST:
      return state.merge({ loading: true, error: null }) as SeriesState;

    case FETCH_SERIES_SUCCESS: {
      const seriesArray = action.payload as Series[];
      let seriesById = state.get("seriesById");
      seriesArray.forEach((series) => {
        seriesById = seriesById.set(series.id, series);
      });
      return state.merge({
        seriesById,
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

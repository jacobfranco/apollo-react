import { Record, List as ImmutableList } from 'immutable';
import { Series } from 'src/schemas/series';
import {
  FETCH_SERIES_REQUEST,
  FETCH_SERIES_SUCCESS,
  FETCH_SERIES_FAILURE,
  UPDATE_SERIES,
} from 'src/actions/series';

interface SeriesStateProps {
  series: ImmutableList<Series>;
  loading: boolean;
  error: string | null;
}

// Create a Record factory with default values
const SeriesStateRecord = Record<SeriesStateProps>({
  series: ImmutableList<Series>(),
  loading: false,
  error: null,
});

// Define the type of your state as an instance of the Record
type SeriesState = Record<SeriesStateProps> & Readonly<SeriesStateProps>;

// Initialize your state using the Record
const initialState: SeriesState = new SeriesStateRecord();

export default function seriesReducer(
  state: SeriesState = initialState,
  action: any,
): SeriesState {
  switch (action.type) {
    case FETCH_SERIES_REQUEST:
      return state.merge({ loading: true, error: null }) as SeriesState;
    case FETCH_SERIES_SUCCESS:
      return state.merge({
        series: ImmutableList<Series>(action.payload),
        loading: false,
      }) as SeriesState;
    case FETCH_SERIES_FAILURE:
      return state.merge({ loading: false, error: action.payload }) as SeriesState;
    case UPDATE_SERIES: {
      const updatedSeries = action.payload as Series;
      const seriesList = state.get('series');
      const index = seriesList.findIndex((s: Series) => s.id === updatedSeries.id);

      if (index >= 0) {
        return state.set(
          'series',
          seriesList.set(index, updatedSeries),
        ) as SeriesState;
      } else {
        return state.set(
          'series',
          seriesList.push(updatedSeries),
        ) as SeriesState;
      }
    }
    default:
      return state;
  }
}

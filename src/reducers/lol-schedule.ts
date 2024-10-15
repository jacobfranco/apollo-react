import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { Series } from 'src/schemas/series';
import {
  FETCH_LOL_SCHEDULE_REQUEST,
  FETCH_LOL_SCHEDULE_SUCCESS,
  FETCH_LOL_SCHEDULE_FAILURE,
} from 'src/actions/lol-schedule';

interface LolScheduleState {
  series: ImmutableList<Series>;
  loading: boolean;
  error: string | null;
}

const initialState: LolScheduleState = {
  series: ImmutableList(),
  loading: false,
  error: null,
};

export default function lolScheduleReducer(
  state = ImmutableMap(initialState),
  action: any
): ImmutableMap<string, any> {
  switch (action.type) {
    case FETCH_LOL_SCHEDULE_REQUEST:
      return state.merge({
        loading: true,
        error: null,
      });
    case FETCH_LOL_SCHEDULE_SUCCESS:
      return state.merge({
        series: ImmutableList(action.payload),
        loading: false,
      });
    case FETCH_LOL_SCHEDULE_FAILURE:
      return state.merge({
        loading: false,
        error: action.payload,
      });
    default:
      return state;
  }
}
